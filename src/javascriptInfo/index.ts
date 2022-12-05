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
  const home = "https://zh.javascript.info/"
  try {
    const page = await context.newPage()
    await page.goto(home)
    const data = JSON.parse(
      await page.evaluate(`
(() => {
const ret= [...document.querySelectorAll(
    ".frontpage-content__title,.list__link,.list-sub__link"
  )
]
  .reduce(
    (acc, cur) => {
      if (cur.className.includes("frontpage-content__title"))
        acc.folders[0] = cur.innerText
      else if (cur.className.includes("list__link"))
        acc.folders[1] = cur.innerText
      else if (acc.folders.length === 2) {
        acc.items.push({
          title: cur.innerText,
          url: cur.href,
          folders: acc.folders.map(name => ({ name }))
        })
      }
      return acc
    },
    { items: [], folders: [undefined, undefined] }
  ).items
  return JSON.stringify(ret, null, 2)
})()
  `)
    ) as WebPage[]
    await page.close()
    return data.filter((k, i) =>
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
  if (pagesInfo.length) {
    slog(`Printing ${name}...`)
    console.log("\n")
    await print(name, pagesInfo, context, {
      async injectFunc() {
        await delay(700)
      },
      stylePath: "src/javascriptInfo/style.css",
      printOption
    })
  }
}
