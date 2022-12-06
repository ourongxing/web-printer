import type { BrowserContext } from "playwright"
import { print } from "~/core"
import type { PrintOption, PageFilter, WebPage } from "~/types"
import { delay } from "~/utils"
import { stdout as slog } from "single-line-log"

async function fetchPagesInfo(
  pageFilter: PageFilter,
  context: BrowserContext
): Promise<WebPage[]> {
  slog(`Fetching Pages Info...`)
  try {
    const page = await context.newPage()
    await page.goto("https://juejin.cn/?sort=weekly_hottest")
    await page.evaluate("window.scrollBy(0, 3000)")
    await delay(300)
    const data = JSON.parse(
      await page.evaluate(`
(() => {
  const ret = [...document.querySelectorAll(".entry .title-row a")].map(k=>({title: k.innerText, url:k.href}))
  return JSON.stringify(ret, null, 2)
})()
  `)
    ) as WebPage[]
    await page.close()
    return data
      .filter(k => !k.title.includes("掘金"))
      .filter((k, i) =>
        pageFilter({
          ...k,
          index: i,
          length: data.length
        })
      )
  } catch (e) {
    slog("Fetch Filed")
    console.log(e)
    return []
  }
}

export default async function (
  name: string,
  pageFilter: PageFilter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const pagesInfo = await fetchPagesInfo(pageFilter, context)
  await print(name, pagesInfo, context, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/juejinWeekly/style.css",
    printOption
  })
}
