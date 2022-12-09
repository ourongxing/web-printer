import type { PageInfo, Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: {
  url: string
  scroll?: {
    times: number
    interval: number
  }
}): Plugin {
  const { url } = options
  const scroll = options.scroll ?? { times: 3, interval: 500 }
  return {
    async fetchPagesInfo({ context }) {
      const page = await context.newPage()
      await page.goto(url)
      for (let i = 0; i < scroll.times; i++) {
        await delay(scroll.interval)
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
    async beforePrint({ page }) {
      await delay(700)
    },
    injectStyle() {
      const style = `
.main-header-box,
.action-bar,
.recommended-area,
.recommended-links,
.extension-banner,
.category-course-recommend,
.comment-form,
.follow-button,
.comment-list-wrapper,
.wechat-banner,
.column-container,
.copy-code-btn {
    display: none !important;
}

#juejin > div.view-container > main > div {
    padding: 0 !important;
    margin: 0
}

html {
    background-color: #fff !important;
}

article {
    padding: 0 !important;
}

`
      return {
        style,
        titleSelector: `#juejin > div.view-container > main > div`
      }
    }
  }
}
