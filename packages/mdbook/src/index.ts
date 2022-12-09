import type { Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"

export default function (options: { url: string }): Plugin {
  const { url } = options
  return {
    async fetchPagesInfo({ context }) {
      const page = await context.newPage()
      await page.goto(url)
      const data = JSON.parse(
        await page.evaluate(`
(() => {
  function deepTransform(nodes, groups) {
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
          selfGroup: true,
          groups: groups.map(f => ({ name: f }))
        })
      nodes.forEach(item => {
        deepTransform(item, [...groups, title])
      })
    } else {
      ret.push({
        ...genPageItem(nodes),
        groups: groups.map(name => ({ name }))
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
      )
      await page.close()
      return data
    },
    async beforePrint({ page }) {
      for (let i = 0; i < 10; i++) {
        await delay(200)
        await page.evaluate("window.scrollBy(0, 3000)")
      }
    },
    injectStyle() {
      const style = `
#menu-bar,
#giscus-container,
.nav-wrapper,
.sidetoc {
    display: none !important;
}

main {
    margin: 0 !important;
}

main > * {
    margin-top: 0
}

#page-wrapper > div,
#content {
    padding: 0;
}
`
      return {
        style,
        titleSelector: `main > *`
      }
    }
  }
}
