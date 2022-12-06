import type { BrowserContext, Page } from "playwright"
import { print } from "~/core"
import type { PrintOption, PageFilter, WebPage } from "~/types"
import { delay } from "~/utils"
import { stdout as slog } from "single-line-log"

async function fetchPagesInfo(
  home: string,
  pageFilter: PageFilter,
  content: BrowserContext
): Promise<WebPage[]> {
  slog(`Fetching Pages Info...`)
  const data: any[] = []
  const page = await content.newPage()
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
    .sort(
      (m, n) =>
        new Date(m.created_at).getTime() - new Date(n.created_at).getTime()
    )
    .map(k => ({ url: `https://xiaobot.net/post/${k.uuid}`, title: k.title }))
    .filter(
      (k, i) =>
        k.title &&
        pageFilter({
          ...k,
          index: i,
          length: data.length
        })
    )
}

export default async function (
  name: string,
  home: string,
  pageFilter: PageFilter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const pagesInfo = await fetchPagesInfo(home, pageFilter, context)
  await print(name, pagesInfo, context, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/xiaobot/style.css",
    printOption
  })
}
