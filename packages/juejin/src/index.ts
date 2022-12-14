import type { Plugin } from "@web-printer/core"
import { evaluateWaitForImgLoad } from "@web-printer/core"
import type { PageInfo } from "@web-printer/core"
import { scrollLoading } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: {
  /**
   * url of a article list page
   * @example
   * - "https://juejin.cn/frontend"
   * - "https://juejin.cn/tag/JavaScript"
   * - "https://juejin.cn/column/6960944886115729422"
   */
  url: string
  /**
   * when the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
}): Plugin {
  const { url, interval = 500, maxPages = Infinity } = options
  if (!url) throw new Error("url is required")
  return {
    async fetchPagesInfo({ context }) {
      const page = await context.newPage()
      await page.goto(url)
      const fetchItemsNum = async () =>
        Number(
          await page.evaluate(
            `document.querySelectorAll(".entry .title-row a").length`
          )
        )
      await scrollLoading(page, fetchItemsNum, {
        interval,
        maxPages
      })
      const pagesInfo: PageInfo[] = JSON.parse(
        await page.evaluate(`
      (() => {
        const ret = [...document.querySelectorAll(".entry .title-row a")].map(k=>({title: k.innerText, url:k.href}))
        return JSON.stringify(ret)
      })()
        `)
      )
      await page.close()
      return pagesInfo.filter(k => !k.title.includes("掘金")).slice(0, maxPages)
    },
    async onPageLoaded({ page }) {
      await evaluateWaitForImgLoad(page, "article img")
    },
    injectStyle() {
      const style = `
.copy-code-btn,
.ategory-course-recommend {
    display: none !important;
}

html {
    background-color: #fff !important;
}

.markdown-body {
    background-image: "unset"
}
`
      return {
        style,
        contentSelector: "article"
      }
    }
  }
}
