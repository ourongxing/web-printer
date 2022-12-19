import type { BrowserContext } from "playwright"
import fs from "fs-extra"
import type { PDFBuffer, PrinterPrintOption, PageInfo, Plugin } from "./typings"
import { ProgressBar, slog } from "./utils"
import { mergePDF } from "./pdf"
import path from "path"
import { evaluateShowOnly } from "./evaluate"

export async function print(
  name: string,
  pagesInfo: PageInfo[],
  context: BrowserContext,
  options: {
    onPageWillPrint?: Plugin["onPageWillPrint"]
    injectStyle?: Plugin["injectStyle"]
    onPageLoaded?: Plugin["onPageLoaded"]
    otherParams?: Plugin["otherParams"]
    outputDir: string
    threads: number
    printOption: PrinterPrintOption
  }
) {
  const {
    onPageLoaded,
    onPageWillPrint,
    printOption,
    outputDir,
    injectStyle,
    otherParams
  } = options
  const { margin, continuous, style: globalStyle, test } = printOption
  if (test) {
    name = "test: " + name
    pagesInfo = pagesInfo.slice(0, 2)
  }
  const length = pagesInfo.length
  const threads = Math.min(length, options.threads)
  slog(`Printing ${name}...`)
  console.log("\n")
  const marginY = 60
  const marginX = 55
  printOption.margin = {
    top: continuous ? 0 : margin?.top ?? marginY,
    bottom: continuous ? 0 : margin?.bottom ?? marginY,
    left: margin?.left ?? marginX,
    right: margin?.right ?? marginX
  }

  const progressBar = new ProgressBar(30)
  const completed: { title: string; status: boolean }[] = []
  const timer = setInterval(() => {
    if (completed.length === length) clearInterval(timer)
    else {
      progressBar.render(
        completed.length
          ? `${completed[0].status ? "✅" : "❌"} ${completed[0].title}`
          : "...",
        {
          completed: completed.length,
          total: length
        }
      )
    }
  }, 500)
  const pdfs = (
    await Promise.all(
      Array.from({ length: threads }).map((_, i) => {
        return printThread(pagesInfo.filter(k => k.index % threads === i))
      })
    )
  )
    .flat()
    .sort((a, b) => a.index - b.index)

  async function printThread(slice: PageInfo[]) {
    const pdfs: PDFBuffer[] = []
    const page = await context.newPage()
    for (const pageInfo of slice) {
      const { url, title } = pageInfo
      try {
        try {
          await page.goto(url, {
            waitUntil: "networkidle"
          })
        } catch (e) {
          await page.goto(url, {
            timeout: 60000,
            waitUntil: "networkidle"
          })
        }
        onPageLoaded && (await onPageLoaded({ page, pageInfo, printOption }))
        if (injectStyle) {
          const { style, titleSelector, contentSelector, avoidBreakSelector } =
            await injectStyle({
              url,
              printOption
            })
          contentSelector && (await evaluateShowOnly(page, contentSelector))
          const top =
            typeof margin?.top === "number"
              ? margin.top
              : margin?.top && margin.top.endsWith("px")
              ? margin.top.replace("px", "")
              : marginY
          const css = (
            [
              style,
              globalStyle,
              continuous &&
                `${
                  titleSelector ||
                  contentSelector?.split(/\s*,\s*/)[0] ||
                  "body"
                } { margin-top: ${top}px !important; }`,
              !continuous &&
                `pre,blockquote,tbody tr { page-break-inside: avoid; }`,
              !continuous &&
                avoidBreakSelector &&
                `
              ${avoidBreakSelector} { page-break-inside: avoid !important;}
              `
            ]
              .flat()
              .filter(k => k) as string[]
          ).join("\n")
          await page.addStyleTag({
            content: css
          })
        } else {
          await page.addStyleTag({
            content: ([globalStyle].flat().filter(k => k) as string[]).join(
              "\n"
            )
          })
        }

        if (otherParams) {
          const { hashIDSelector = "h1[id],h2[id],h3[id],h4[id],h5[id]" } =
            await otherParams({
              page,
              pageInfo,
              printOption
            })
          if (printOption.replaceLink) {
            await page.evaluate(`
          (()=>{
            const nodes = Array.from(
              document.querySelectorAll("${hashIDSelector}")
            )
            nodes.forEach(k => {
              const hashNode = document.createElement("a")
              hashNode.text = "'"
              if (k.id) {
                hashNode.href = "https://web.printer/" + k.id
                k.prepend(hashNode)
                hashNode.style.opacity = "0.01"
              }
            })
          })()
          `)

            await page.evaluate(`
            Array.from(document.querySelectorAll("a")).forEach(k=>{
              if(k.hash && k.href.startsWith(window.location.href)) {
                k.href = "https://self.web.printer/" + k.hash.slice(1)
              }
            })
        `)
          }
        }

        onPageWillPrint &&
          (await onPageWillPrint({ page, pageInfo, printOption }))

        pdfs.push({
          ...pageInfo,
          buffer: await page.pdf({
            format: "A4",
            ...printOption,
            pageRanges: undefined,
            path: undefined
          })
        })
        completed.unshift({
          title,
          status: true
        })
      } catch (e) {
        completed.unshift({
          title,
          status: false
        })
        console.log(e)
      }
    }
    await page.close()
    return pdfs
  }

  await context.close()
  const outPath = path.resolve(outputDir, `${name}.pdf`)
  await fs.ensureDir(outputDir)
  console.clear()
  if (pdfs.length) {
    slog("Generating PDF...")
    await fs.writeFile(outPath, await mergePDF(pdfs, printOption))
    slog(`Generated ${outPath}`)
  } else {
    slog("No pdf generated")
  }
}
