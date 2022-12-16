import type { Page } from "playwright"

export async function evaluateShowOnly(page: Page, selector: string) {
  await page.evaluate(`
  (()=>{
    function showOnly(selector){
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

      const constantNodes = nodes.reduce((acc, node) => {
        const descendantNodes = [...node.querySelectorAll("*")]
        const ancestorNodes = getAncestorNodes(node)

        ;[...ancestorNodes, node].forEach(k => {
          k.style.setProperty("margin-right", "0", "important")
          k.style.setProperty("margin-left", "0", "important")
          k.style.setProperty("margin-top", "0")
          k.style.setProperty("margin-bottom", "0")
          k.style.setProperty("padding", "0", "important")
        })
        acc.push(...descendantNodes, ...ancestorNodes, node)
        return acc
      }, [])


      for (const k of Array.from(document.body.querySelectorAll("*:not(style,script,meta)"))){
        if (!constantNodes.some(m => m === k)) {
          k.style.setProperty("display", "none", "important")
        }
      }
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
        for (const img of Array.from(document.querySelectorAll("${imgSelector}"))) {
          img.scrollIntoView(true)
          await delay(${waitingTime})
        }
      })()
    `)
}
