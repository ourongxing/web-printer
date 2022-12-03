import { Page } from "playwright"
import fs from "fs-extra"
import { PrintOption } from "~/types"
import { ProgressBar, projectRoot } from "~/utils"
import { mergePDF, shrinkPDF } from "./pdf"
import buffer2arraybuffer from "buffer-to-arraybuffer"
import { stdout as slog } from "single-line-log"

export async function print(
  name: string,
  pagesInfo: { title: string; url: string }[],
  page: Page,
  options?: {
    injectFunc?: () => Promise<void>
    stylePath?: string
    printOption?: PrintOption
  }
) {
  const { injectFunc, stylePath, printOption } = options || {}
  const pdfs: { buffer: ArrayBuffer; title: string }[] = []
  const bar = new ProgressBar(30)
  for (const [index, { title, url }] of pagesInfo.entries()) {
    let status = "√"
    try {
      await page.goto(url)
      stylePath &&
        (await page.addStyleTag({
          path: await projectRoot(stylePath)
        }))
      injectFunc && (await injectFunc())
      pdfs.push({
        buffer: buffer2arraybuffer(await page.pdf(printOption)),
        title: title
      })
    } catch (e) {
      console.log(e)
      status = "×"
    } finally {
      bar.render(`${status} ${title}`, {
        completed: index + 1,
        total: pagesInfo.length
      })
    }
  }
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
