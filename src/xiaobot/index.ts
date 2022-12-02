import buffer2arraybuffer from "buffer-to-arraybuffer"
import fs from "fs-extra"
import path from "path"
import { BrowserContext } from "playwright"
import { PrintOption } from "~/types"
import { delay, mergePDF } from "~/utils"

async function fetchXiaoBotPages(context: BrowserContext, home: string) {
  const data: any[] = []
  const page = await context.newPage()
  await page.goto(home)
  page.on("response", res => {
    if (res.url().includes("limit=")) {
      res.json().then(d => {
        data.push(...d.data)
      })
    }
  })
  for (let i = 0; i < 10; i++) {
    await delay(200)
    await page.evaluate("window.scrollBy(0, 5000)")
  }
  await page.close()
  return data
    .filter(k => k.title && k.title.startsWith("Vol"))
    .map(k => ({ uuid: k.uuid, title: k.title, date: k.created_at }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default async function (
  context: BrowserContext,
  home: string,
  name: string,
  options?: PrintOption
) {
  const pdfs: { buffer: ArrayBuffer; title: string }[] = []
  const pagesInfo = await fetchXiaoBotPages(context, home)
  const page = await context.newPage()
  for (const info of pagesInfo) {
    await page.goto(`https://xiaobot.net/post/${info.uuid}`)
    await delay(700)
    pdfs.push({
      buffer: buffer2arraybuffer(await page.pdf(options)),
      title: info.title
    })
  }
  await page.close()
  const outPath = path.join(__dirname, `../../pdf/${name}.pdf`)
  await fs.writeFile(outPath, await mergePDF(pdfs))
}
