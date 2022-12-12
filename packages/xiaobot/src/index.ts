import type { Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: {
  /**
   * url of the newsletter home page that you want to print
   * @example https://xiaobot.net/p/pmthinking2022
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
      const times = scroll?.times ?? 3
      const interval = scroll?.interval ?? 500
      for (let i = 0; i < times; i++) {
        await delay(interval)
        await page.evaluate("window.scrollBy(0, 5000)")
      }
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
    async beforePrint() {
      await delay(700)
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
