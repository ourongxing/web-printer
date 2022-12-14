import type { Plugin } from "@web-printer/core"
import { evaluateWaitForImgLoad, scrollLoading } from "@web-printer/core"

export default function (options: {
  /**
   * url of the newsletter home page that you want to print
   * @example
   * - "https://xiaobot.net/p/pmthinking2022"
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
  const { url, maxPages = Infinity, interval = 500 } = options
  if (!url) throw new Error("url is required")
  return {
    async fetchPagesInfo({ context }) {
      const data: any[] = []
      const page = await context.newPage()
      await page.goto(url)
      page.on("response", res => {
        if (res.url().includes("limit=")) {
          res.json().then(d => {
            data.push(...d.data)
          })
        }
      })
      await scrollLoading(page, () => data.length, {
        interval,
        maxPages
      })
      await page.close()
      return data
        .sort(
          (m, n) =>
            new Date(m.created_at).getTime() - new Date(n.created_at).getTime()
        )
        .map(k => ({
          url: `https://xiaobot.net/post/${k.uuid}`,
          title: k.title
        }))
    },
    async onPageLoaded({ page }) {
      await evaluateWaitForImgLoad(page, ".content img")
    },
    injectStyle() {
      const style = `
.left {
    max-width: 100% !important;
}
body {
    background: #fff !important;
}
`
      return {
        style,
        contentSelector: ".content, .title"
      }
    }
  }
}
