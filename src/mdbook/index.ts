import type { BrowserContext } from "playwright"
import { print } from "~/core"
import type { PrintOption, PageFilter, WebPage } from "~/types"
import { delay } from "~/utils"
import { stdout as slog } from "single-line-log"

async function fetchPagesInfo(
  home: string,
  pageFilter: PageFilter,
  context: BrowserContext
): Promise<WebPage[]> {
  slog(`Fetching Pages Info...`)
  try {
    const page = await context.newPage()
    await page.goto(home)
    const data = JSON.parse(
      await page.evaluate(`
(() => {
  function deepTransform(nodes, folders) {
    function genPageItem(node) {
      const a = node.childNodes[0]
      return {
        title: a?.innerText,
        url: a?.href
      }
    }
    if (Array.isArray(nodes)) {
      const f = nodes.shift()
      const { title, url } = genPageItem(f)
      if (url)
        ret.push({
          title,
          url,
          isFolder: true,
          folders: folders.map(f => ({ name: f }))
        })
      nodes.forEach(item => {
        deepTransform(item, [...folders, title])
      })
    } else {
      ret.push({
        ...genPageItem(nodes),
        folders: folders.map(name => ({ name }))
      })
    }
  }

  function deepFetch(nodes) {
    return nodes.reduce((acc, cur) => {
      if (!cur.className && acc.length) {
        const chapter = acc.pop()
        acc.push(deepFetch([chapter, ...cur.childNodes[0].childNodes]))
      } else {
        cur.innerText && acc.push(cur)
      }
      return acc
    }, [])
  }

  const nodes = [...document.querySelectorAll(".chapter > li")].filter(
    k => !["spacer", "affix", "part-title"].some(h => k.className.includes(h))
  )

  const ret = []
  deepFetch(nodes).forEach(items => {
    deepTransform(items, [])
  })
  return JSON.stringify(ret, null, 2)
})()
  `)
    ) as WebPage[]
    await page.close()
    return data.filter((k, i) =>
      pageFilter({
        ...k,
        index: i,
        length: data.length
      })
    )
  } catch (e) {
    slog("Fetch Filed")
    console.log(e)
    return []
  }
}

export default async function (
  name: string,
  home: string,
  pageFilter: PageFilter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const pagesInfo = await fetchPagesInfo(home, pageFilter, context)
  await print(name, pagesInfo, context, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/mdbook/normal.css",
    printOption
  })
}
