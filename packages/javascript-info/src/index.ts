import type { PageInfo, Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: {
  lang:
    | "AR"
    | "EN"
    | "ES"
    | "FA"
    | "FR"
    | "ID"
    | "IT"
    | "JA"
    | "KO"
    | "RU"
    | "TR"
    | "UK"
    | "ZH"
}): Plugin {
  const url = `https://${
    options.lang === "EN" ? "" : options.lang.toLowerCase() + "."
  }javascript.info/`
  return {
    async fetchPagesInfo({ context }) {
      const page = await context.newPage()
      await page.goto(url)
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
        acc.groups[0] = cur.innerText
      else if (cur.className.includes("list__link"))
        acc.groups[1] = cur.innerText
      else if (acc.groups.length === 2) {
        acc.items.push({
          title: cur.innerText,
          url: cur.href,
          groups: acc.groups.map(name => ({ name }))
        })
      }
      return acc
    },
    { items: [], groups: [undefined, undefined] }
  ).items

  return JSON.stringify(ret, null, 2)
})()
  `)
      ) as PageInfo[]
      await page.close()
      return data
    },
    async beforePrint() {
      await delay(700)
    },
    injectStyle() {
      const style = `
.sitetoolbar__content,
.main__header-group,
#comments,
.page-footer,
.tutorial-progress,
.page__nav-wrap,
.article-tablet-foot,
.codebox__toolbar,
.sitetoolbar {
    display: none !important;
}

.page__inner, main {
    padding:0 !important;
    margin: 0 !important;
}

.main__header {
    margin-top: 0
}
`
      return {
        style,
        titleSelector: ".main__header"
      }
    }
  }
}
