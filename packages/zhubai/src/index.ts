import type { Plugin } from "@web-printer/core"
import { evaluateWaitForImgLoad, scrollLoading } from "@web-printer/core"

export default function (options: {
  /**
   * Url of the newsletter home page that you want to print
   * @example https://hsxg.zhubai.love/
   */
  url: string
  /**
   * When the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * Interval of each scroll
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
          url: `${url.replace(/\/$/, "")}/posts/${k.id}`,
          title: k.title
        }))
    },
    async onPageLoaded({ page }) {
      await evaluateWaitForImgLoad(page, "img")
    },
    injectStyle() {
      const style = `
div[class*="PostPage_navRoot"],
button[class*="Button_button"],
div[class*="PostPage_footer"]{
    display: none !important;
}

h1[class*=PostPage_title]{
    margin-top: 0 !important;
}

div[class*=PostPage_post]{
    margin: 0;
    padding: 0;
}
`
      return {
        style,
        titleSelector: "h1[class*=PostPage_title]"
      }
    }
  }
}
