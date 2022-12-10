import type { PageInfo, Plugin } from "@web-printer/core"
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
  function genGroups(nodes, groups) {
    return nodes.reduce((acc, node, i) => {
      const paddingLeft = Number(node.style.paddingLeft.replace("px", ""))
      let selfGroup = false
      if(i!==0) {
        const interval = paddingLeft - acc.paddingLeft
        if(interval > 0) {
          if(acc.interval === 0) acc.interval = interval
          acc.groups.push(acc.title)
          selfGroup = true
        } else if(interval < 0) {
          for(let i=0; i<Math.abs(interval/acc.interval); i++) acc.groups.pop()
        }
      }

      acc.title = node.innerText
      acc.paddingLeft = paddingLeft
      acc.items.push({title: node.innerText, url: node.href, selfGroup, groups: [...acc.groups]})
      return acc
    }, {items:[], paddingLeft:0, title: "", groups, interval: 0}).items.filter(k => k.url)
  };
  const ret = [...document.querySelectorAll("#VPSidebarNav .group")].map((k,i)=> {
      const title = k.querySelector(".title")?.innerText
      if(i && !title) return []
      return genGroups([...k.querySelectorAll(".items .link")], title ? [{
        name: title,
        collapsed: !!k.querySelector(".collapsed")
      }]:[])
  }).flat()
  return JSON.stringify(ret)
})()
  `)
      ) as PageInfo[]
      await page.close()
      return data
    },
    async beforePrint({ page }) {
      await delay(700)
    },
    injectStyle() {
      const style = `
.VPLocalNav ,
.VPDocFooter,
.VPNav,
.edit-link,
.VPContentDocFooter,
.vueschool,
.vue-mastery-link,
.vuejobs-wrapper {
    display: none !important;
}

.VPDoc,.content-container {
    padding: 0 !important;
    margin: 0 !important;
}

.vp-doc div[class*=language-] {
    margin-left: 0!important;
}
`
      return {
        style,
        titleSelector: `main`
      }
    }
  }
}
