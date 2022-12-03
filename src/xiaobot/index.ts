import type { BrowserContext, Page } from "playwright"
import { print } from "~/core"
import type { PrintOption, Filter } from "~/types"
import { delay } from "~/utils"
import { stdout as slog } from "single-line-log"

async function fetchPagesInfo(home: string, filter: Filter, page: Page) {
  const data: any[] = []
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
  return data
    .filter((k, i) => k.title && filter(k.title, i, data.length))
    .sort(
      (m, n) =>
        new Date(m.created_at).getTime() - new Date(n.created_at).getTime()
    )
    .map(k => ({ url: `https://xiaobot.net/post/${k.uuid}`, title: k.title }))
}

export default async function (
  name: string,
  home: string,
  filter: Filter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const page = await context.newPage()
  slog(`Fetching ${name} Pages...`)
  const pagesInfo = await fetchPagesInfo(home, filter, page)
  slog(`Printing ${name}...`)
  console.log("\n")
  await print(name, pagesInfo, page, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/xiaobot/style.css",
    printOption
  })
  await page.close()
}
