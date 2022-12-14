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
  await page.evaluate(
    async ({ imgSelector }) => {
      await Promise.all(
        (
          Array.from(
            document.querySelectorAll(imgSelector)
          ) as HTMLImageElement[]
        ).map(
          k =>
            k.complete ||
            new Promise(r => {
              const img = new Image()
              img.src = k.src
              img.onload = r
            })
        )
      )
    },
    { imgSelector }
  )
}

export async function evaluateWaitForImgLoadLazy(
  page: Page,
  imgSelector = "img",
  waitingTime = 200
) {
  await page.evaluate(
    async ({ imgSelector, waitingTime }) => {
      function delay(t: number) {
        return new Promise(resolve => setTimeout(resolve, t))
      }
      for (const img of Array.from(
        document.querySelectorAll(imgSelector)
      ) as HTMLImageElement[]) {
        if (
          img.style.display === "none" ||
          (img?.width ?? 100) * (img?.height ?? 100) < 2500
        )
          continue
        img.scrollIntoView(true)
        await delay(waitingTime)
      }
    },
    { imgSelector, waitingTime }
  )
}

export async function waitForNetworkIdle(
  page: Page,
  timeout = 500,
  maxInflightRequests = 0
) {
  page.on("request", onRequestStarted)
  page.on("requestfinished", onRequestFinished)
  page.on("requestfailed", onRequestFinished)

  let inflight = 0
  let fulfill: any
  const promise = new Promise(x => (fulfill = x))
  let timeoutId = setTimeout(onTimeoutDone, timeout)
  return promise

  function onTimeoutDone() {
    page.removeListener("request", onRequestStarted)
    page.removeListener("requestfinished", onRequestFinished)
    page.removeListener("requestfailed", onRequestFinished)
    fulfill()
  }

  function onRequestStarted() {
    ++inflight
    if (inflight > maxInflightRequests) clearTimeout(timeoutId)
  }

  function onRequestFinished() {
    if (inflight === 0) return
    --inflight
    if (inflight === maxInflightRequests)
      timeoutId = setTimeout(onTimeoutDone, timeout)
  }
}
