import type { Page } from "playwright"
import type { SubOutlineItem } from "./typings"

export async function evaluateShowOnly(page: Page, selector: string) {
  page.addStyleTag({
    content: `
              .web-printer-hidden {
                  display: none!important;
              }

              .web-printer-no-margin {
                  margin: 0!important;
                  padding: 0!important;
              }

              .web-printer-title {
                  margin-top: 0!important;
                  line-height: 1em;
              }

              .web-printer-avoid-break-inside {
                  page-break-inside: avoid!important;
              }

              .web-printer-full-width {
                  width: 100vw!important;
                  min-width: 100vw!important;
                  max-width: 100vw!important;
              }

              .web-printer-wrap-code {
                  white-space: pre-wrap!important;
              }

              .web-printer-white-bg {
                  background-color: white!important;
              }

              .web-printer-article-link:link,.web-printer-article-link:visited,.web-printer-article-link:hover,.web-printer-article-link:active {
                  text-decoration: none;
                  color:inherit;
              }
    `
  })
  await page.evaluate(`
  (()=>{
    function showOnly(selector,hidden=true){
      function getAncestorNodes(node, ancestor = []) {
        if (node.parentNode) {
          if (node.parentNode.nodeName !== "BODY") {
            ancestor.push(node.parentNode)
            getAncestorNodes(node.parentNode, ancestor)
          }
        }
        return ancestor
      }

      const nodes = [...document.querySelectorAll(selector)]
      if (!nodes.length) return

      nodes.forEach(node => {
        const ancestorNodes = getAncestorNodes(node)
        node.classList.add("web-printer-no-margin","web-printer-full-width","web-printer-white-bg","web-printer-target");
        [document.body, ...ancestorNodes].forEach(k => {
          k.classList.add("web-printer-no-margin","web-printer-full-width","web-printer-white-bg","web-printer-parent")
        })
      })

      document.querySelectorAll(".web-printer-parent>*:not(.web-printer-parent,.web-printer-target,style,script,meta,link)").forEach(k=>{
        if(hidden){
           k.classList.add("web-printer-hidden")
        } else k.remove()
      })
    }

    showOnly("${selector}")
  })()
  `)
}

export async function evaluateScrollToBottom(page: Page, scrollStep = 50) {
  await page.evaluate(
    `(async ()=>{
    const html = document.querySelector("html");
    function scrollToBottom(){
      const bottom = html.scrollHeight - window.innerHeight - html.scrollTop
      if (bottom > 0) {
        return new Promise(resolve => {
          requestAnimationFrame(resolve);
          window.scrollTo(0, html.scrollTop+${scrollStep});
        }).then(scrollToBottom);
      } else return Promise.resolve();
    };
    await scrollToBottom();
  })()`
  )
}

export async function evaluateScrollToTop(page: Page, scrollStep = 50) {
  await page.evaluate(
    `(async ()=>{
    const html = document.querySelector("html");
    function scrollToTop(){
      const top = html.scrollTop
      if (top > 0) {
        return new Promise(resolve => {
          requestAnimationFrame(resolve);
          window.scrollTo(0,top - ${scrollStep});
        }).then(scrollToTop);
      } else return Promise.resolve();
    };
    await scrollToTop();
  })()`
  )
}

export async function evaluateWaitForImgLoad(page: Page, imgSelector = "img") {
  await page.evaluate(`
    (async () => {
      await Promise.all(Array.from(document.querySelectorAll("${imgSelector}")).map(
          k => k.complete || new Promise(r => {
              const img = new Image()
              img.src = k.src
              img.onload = r
            })
        ))
    })()
    `)
}

export async function evaluateWaitForImgLoadLazy(
  page: Page,
  imgSelector = "img",
  waitingTime = 200
) {
  await page.evaluate(`
      (async () => {
        function delay(t) {
          return new Promise(resolve => setTimeout(resolve, t))
        }
        const imgs = Array.from(document.querySelectorAll("${imgSelector}"))
        for (const img of imgs) {
          img.scrollIntoView(true)
          if((img?.width ?? 10) * (img?.height ?? 10) > 1000) {
            await delay(${waitingTime})
          } else {
            await delay(100)
          }
        }
      })()
    `)
}

export async function fetchVariousTitles(
  page: Page,
  contentSelector: string
): Promise<SubOutlineItem[]> {
  return await page.evaluate(`
          (()=>{
            const titleSelectors = ["h2", "h3", "h4", "h5", "h6"]
            return Array.from(
                document.querySelector("${contentSelector}").querySelectorAll(titleSelectors.join(","))
              ).reduce((acc, cur) => {
                const title = cur.innerText.split(/\\s*\\n+/)[0].replace(/^\\s*#\\s*/, "")
                const index = titleSelectors.indexOf(cur.nodeName.toLowerCase())
                if (title&&index !== -1) {
                  if(!cur.id) cur.id = crypto.randomUUID()
                  acc.push({
                    title,
                    depth: index,
                    id: encodeURIComponent(cur.id)
                  })
                }
                return acc
              }, [])
          })()
`)
}
