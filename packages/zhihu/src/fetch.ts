import { type PageInfo, scrollLoading } from "@web-printer/core"
import type { BrowserContext } from "playwright"

export async function fetchFlow(
  context: BrowserContext,
  url: string,
  maxPages: number,
  interval: number
) {
  const page = await context.newPage()
  await page.goto(url, {
    waitUntil: "networkidle"
  })
  const fetchItemsNum = async () =>
    Number(
      await page.evaluate(`document.querySelectorAll(".ContentItem").length`)
    )
  await scrollLoading(page, fetchItemsNum, {
    interval,
    maxPages
  })
  const pagesInfo: PageInfo[] = JSON.parse(
    await page.evaluate(`
      (() => {
        const ret = [...document.querySelectorAll(".ContentItem-title a")].map(k=>({title: k.innerText, url:k.href}))
        return JSON.stringify(ret)
      })()
        `)
  )
  await page.close()
  return pagesInfo
}

export async function fetchPagination(
  context: BrowserContext,
  url: string,
  maxPages: number
) {
  url = url.replace(/\?.*$/, "")
  const page = await context.newPage()
  await page.goto(url, {
    waitUntil: "networkidle"
  })
  const n = Number(
    await page.evaluate(
      `(()=>{
        const buttons = document.querySelectorAll("div.Pagination > button:not([class*=next], [class*=prev])");
        if (buttons.length === 0) return 1;
        return buttons[buttons.length - 1].innerText
      })()
      `
    )
  )
  await page.close()
  const p = Array.from(
    { length: Math.min(Math.ceil(maxPages / 20) + 1, n) },
    (_, i) => i + 1
  )
  const threads = Math.min(5, p.length)
  const l = Math.ceil(p.length / threads)
  const pagesInfo = (
    await Promise.all(
      Array.from({ length: threads }, (_, i) => {
        return fetchThread(p.slice(i * l, (i + 1) * l))
      })
    )
  )
    .flat()
    .slice(0, maxPages)

  async function fetchThread(slice: number[]) {
    const ret: PageInfo[] = []
    const page = await context.newPage()
    for (const i of slice) {
      await page.goto(`${url}?page=${i}`)
      await page.goto(url, {
        waitUntil: "networkidle"
      })
      ret.push(
        ...JSON.parse(
          await page.evaluate(`
        (() => {
          const ret = [...document.querySelectorAll(".ContentItem-title a")].map(k=>({title: k.innerText, url:k.href}))
          return JSON.stringify(ret)
        })()
          `)
        )
      )
    }
    await page.close()
    return ret
  }

  return pagesInfo
}
