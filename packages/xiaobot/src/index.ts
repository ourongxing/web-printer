import type { Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: { url: string }): Plugin {
  const { url } = options
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
      for (let i = 0; i < 5; i++) {
        await delay(500)
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
.pc-header,
.header,
.paper-info,
.share-paper,
.light_feedback,
.paper_card,
.actions,
.comment,
.footer_write_comment,
.footer,
#nav_sep {
    display: none !important;
}
.left {
    margin-right: 0 !important;
    max-width: 100% !important;
}
.post_page {
    padding: 0 !important;
}

body {
    background: #fff !important;
}

#app > div > div {
    padding: 0 !important;
}

.title {
    margin-top: 0;
}`
      return {
        style,
        titleSelector: `.title`
      }
    }
  }
}
