import type { PageInfo, Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: {
  /**
   * url of a article list page that you want to print all
   * @example
   * - "https://juejin.cn/frontend"
   * - "https://juejin.cn/tag/JavaScript"
   * - "https://juejin.cn/column/6960944886115729422"
   */
  url: string
  /**
   * scroll to the bottom of the page to load more articles
   */
  scroll?: {
    /**
     * @default 3
     */
    times?: number
    /**
     * @default 500
     */
    interval?: number
  }
}): Plugin {
  const { url, scroll } = options
  if (!url) throw new Error("url is required")
  return {
    async fetchPagesInfo({ context }) {
      const page = await context.newPage()
      await page.goto(url)
      const times = scroll?.times ?? 3
      const interval = scroll?.interval ?? 500
      for (let i = 0; i < times; i++) {
        await delay(interval)
        await page.evaluate("window.scrollBy(0, 5000)")
      }
      const data = JSON.parse(
        await page.evaluate(`
(() => {
  const ret = [...document.querySelectorAll(".entry .title-row a")].map(k=>({title: k.innerText, url:k.href}))
  return JSON.stringify(ret)
})()
  `)
      ) as PageInfo[]
      await page.close()
      return data.filter(k => !k.title.includes("掘金"))
    },
    async beforePrint() {
      await delay(500)
    },
    injectStyle() {
      const style = `
.copy-code-btn {
    display: none !important;
}

html {
    background-color: #fff !important;
}
`
      return {
        style,
        contentSelector: "article"
      }
    }
  }
}
