import { BrowserContext, Page } from "playwright"
import fs from "fs-extra"
import { CustomOption, PDF, PrintOption, WebPage } from "~/types"
import { ProgressBar, projectRoot } from "~/utils"
import { mergePDF, shrinkPDF } from "./pdf"
import buffer2arraybuffer from "buffer-to-arraybuffer"
import { stdout as slog } from "single-line-log"

export async function print(
  name: string,
  pagesInfo: WebPage[],
  context: BrowserContext,
  options?: {
    injectFunc?: (page: Page) => Promise<void>
    stylePath?: string
    printOption?: PrintOption
  }
) {
  const { injectFunc, stylePath, printOption } = options || {}
  const thread = printOption?.thread ?? 1
  const progressBar = new ProgressBar(30)
  let completed = 0
  const timer = setInterval(() => {
    if (completed === pagesInfo.length) clearInterval(timer)
    else {
      progressBar.render("", {
        completed,
        total: pagesInfo.length
      })
    }
  }, 500)
  const pdfs = (
    await Promise.all(
      Array.from({ length: thread }).map((_, i) => {
        const slice = Math.ceil(pagesInfo.length / thread)
        return printThread(pagesInfo.slice(slice * i, slice * (i + 1)))
      })
    )
  ).flat()

  async function printThread(slice: WebPage[]) {
    const pdfs: PDF[] = []
    const page = await context.newPage()
    for (const [index, { url }] of slice.entries()) {
      try {
        try {
          await page.goto(url)
        } catch (e) {
          await page.goto(url, {
            timeout: 60000
          })
        }
        stylePath &&
          (await page.addStyleTag({
            path: await projectRoot(stylePath)
          }))
        injectFunc && (await injectFunc(page))
        pdfs.push({
          ...slice[index],
          buffer: buffer2arraybuffer(await page.pdf(printOption))
        })
      } catch (e) {
        console.log(e)
      }
      completed++
    }
    await page.close()
    return pdfs
  }

  await context.close()
  const outPath = await projectRoot(`./pdf/${name}.pdf`)
  console.clear()
  if (pdfs.length) {
    slog("Generating PDF...")
    await fs.writeFile(outPath, await mergePDF(pdfs))
    if (printOption?.quality) {
      slog("Shrinking PDF...")
      await shrinkPDF(outPath, printOption.quality)
    }
    slog(`Generated ${outPath}`)
  } else {
    slog("No pdf generated")
  }
}
