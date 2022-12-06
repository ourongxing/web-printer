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
  function genPageItem(node) {
    if (node.className.includes("part-title")) return { title: node.innerText }
    else {
      const a = node.childNodes[0]
      return {
        title: a?.innerText,
        url: a?.href
      }
    }
  }
  function deepTransform(nodes, folders) {
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
  const nodeItems = [...document.querySelectorAll(".chapter > li")]
    .reduce((acc, cur) => {
      if (!cur.className.includes("spacer")) {
        if (cur.className.includes("part-title")) acc.unshift([cur])
        else if (acc[0]) {
          if (!cur.className && acc[0].length) {
            const chapter = acc[0].pop()
            acc[0].push(
              [chapter, ...cur.childNodes[0].childNodes].reduce((a, c) => {
                if (!c.className && a.length) {
                  const chapter = a.pop()
                  a.push(
                    [chapter, ...c.childNodes[0].childNodes].reduce((a, c) => {
                      if (!c.className && a.length) {
                        const chapter = a.pop()
                        a.push([chapter, ...c.childNodes[0].childNodes])
                      } else c.innerText && a.push(c)
                      return a
                    }, [])
                  )
                } else c.innerText && a.push(c)
                return a
              }, [])
            )
          } else {
            cur.innerText && acc[0].push(cur)
          }
        }
      }
      return acc
    }, [])
    .reverse()
  const ret = []
  nodeItems.forEach(nodes => {
    deepTransform(nodes, [])
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
