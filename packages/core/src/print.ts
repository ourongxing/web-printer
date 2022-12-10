import type { BrowserContext } from "playwright"
import fs from "fs-extra"
import type { PDFBuffer, PrintOption, PageInfo, Plugin } from "./typings"
import { ProgressBar, slog } from "./utils"
import { mergePDF } from "./pdf"
import path from "path"

export async function print(
  name: string,
  pagesInfo: PageInfo[],
  context: BrowserContext,
  options: {
    beforePrint?: Plugin["beforePrint"]
    outputDir: string
    threads: number
    printOption: PrintOption
  }
) {
  const { beforePrint, printOption, threads, outputDir } = options
  const { margin, continuous, injectedStyle, test } = printOption
  if (test) {
    name = "test: " + name
    pagesInfo = pagesInfo.slice(0, 2)
  }
  const length = pagesInfo.length
  slog(`Printing ${name}...`)
  console.log("\n")
  const css = ([injectedStyle].flat().filter(k => k) as string[]).join("\n")

  printOption.margin = {
    top: margin?.top ?? 60,
    bottom: margin?.bottom ?? 60,
    left: margin?.left ?? 60,
    right: margin?.right ?? 60
  }

  if (continuous) {
    printOption.margin = {
      ...printOption.margin,
      top: 0,
      bottom: 0
    }
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
        return printthreads(pagesInfo.filter(k => k.index % threads === i))
      })
    )
  )
    .flat()
    .sort((a, b) => a.index - b.index)

  async function printthreads(slice: PageInfo[]) {
    const pdfs: PDFBuffer[] = []
    const page = await context.newPage()
    for (const pageInfo of slice) {
      const { url, title } = pageInfo
      try {
        try {
          await page.goto(url)
        } catch (e) {
          await page.goto(url, {
            timeout: 60000
          })
        }
        beforePrint && (await beforePrint({ page, pageInfo }))
        if (css)
          await page.addStyleTag({
            content: css
          })
        pdfs.push({
          ...pageInfo,
          buffer: await page.pdf(printOption)
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
    await fs.writeFile(outPath, await mergePDF(pdfs, printOption?.coverPath))
    slog(`Generated ${outPath}`)
  } else {
    slog("No pdf generated")
  }
}
