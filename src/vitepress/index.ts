import type { BrowserContext } from "playwright"
import { print } from "~/core"
import type { PrintOption, PageFilter, WebPage } from "~/types"
import { delay } from "~/utils"
import { outline } from "./vue-outline"

function fetchPagesInfo(home: string, pageFilter: PageFilter): WebPage[] {
  let ret: WebPage[]
  if (Array.isArray(outline)) {
    ret = outline.reduce((acc, section) => {
      section.items.forEach(item => {
        if (item.link) {
          acc.push({
            title: item.text,
            url: `${home}${item.link}.html`,
            folders: section.text
              ? [{ name: section.text, collapse: section.collapsed }]
              : undefined
          })
        }
      })
      return acc
    }, [] as WebPage[])
  } else {
    ret = Object.entries(outline).reduce((acc, [name, sections]) => {
      sections.forEach(section => {
        section.items.forEach(item => {
          if (item.link) {
            acc.push({
              title: item.text,
              url: `${home}${item.link}.html`,
              folders: [
                { name },
                { name: section.text ?? "", collapse: section.collapsed }
              ].filter(k => k.name)
            })
          }
        })
      })
      return acc
    }, [] as WebPage[])
  }
  return ret.filter((page, index) =>
    pageFilter({ ...page, index, length: ret.length })
  )
}

export default async function (
  name: string,
  home: string,
  pageFilter: PageFilter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const pagesInfo = fetchPagesInfo(home, pageFilter)
  console.log(`Printing ${name}...\n`)
  await print(name, pagesInfo, context, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/vitepress/vue.css",
    printOption
  })
}
