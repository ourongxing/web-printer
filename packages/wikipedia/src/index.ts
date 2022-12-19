import type { Plugin } from "@web-printer/core"
import { evaluateWaitForImgLoadLazy } from "@web-printer/core"
import { evaluateScrollToBottom } from "@web-printer/core"
import style from "./style"

export default function (options: {
  /**
   * Url of a Wikipedia entry
   * @example
   * - "https://en.m.wikipedia.org/wiki/FIFA_World_Cup"
   * - "https://en.wikipedia.org/wiki/FIFA_World_Cup"
   * - [
   *      "https://en.m.wikipedia.org/wiki/FIFA_World_Cup",
   *      "https://en.wikipedia.org/wiki/FIFA_World_Cup"
   *   ]
   */
  urls: string | string[]
  /**
   * Waiting img and latex lazy loading
   * @default 200
   * @unit ms
   */
  imgWaiting?: number
}): Plugin {
  const { urls: _, imgWaiting = 200 } = options
  if (!_ && !_.length) throw new Error("At least one url is required")
  const urls = typeof _ === "string" ? [_] : _
  return {
    async fetchPagesInfo({ context }) {
      function rewriteURL(url: string) {
        if (!url.includes("m.wikipedia"))
          url = url.replace("wikipedia", "m.wikipedia")
        if (url.includes("zh.m.wikipedia") && url.includes("/wiki/")) {
          url = url.replace("/wiki/", "/zh-cn/")
        }
        return url
      }
      return urls.map(k => ({
        title: "",
        url: rewriteURL(k)
      }))
    },
    async onPageLoaded({ page }) {
      await evaluateScrollToBottom(page, 300)
      await evaluateWaitForImgLoadLazy(page, "#bodyContent img", imgWaiting)
      await page.evaluate(`
        Array.from(document.querySelectorAll(".collapsible-heading:not(.open-block)")).forEach(k=>k.click());
        document.querySelector("#toctogglecheckbox")?.click();
        Array.from(document.querySelectorAll(".mw-cite-backlink")).forEach(k=>
          {
            const gap = document.createElement("br")
            k.appendChild(gap)
          })
      `)
      await page.evaluate(() => {
        const { href, origin } = window.location
        if (href.startsWith("https://zh")) {
          let variant = href.replace(/^.*(\/zh-\w{2}\/).*$/, "$1")
          if (variant === href) variant = "/zh-cn/"
          Array.from(
            document.querySelectorAll(
              "#mw-content-text a"
            ) as NodeListOf<HTMLLinkElement>
          ).forEach(k => {
            if (
              k.href.startsWith(origin) &&
              !k.href.startsWith(href) &&
              k.title
            )
              k.href = k.href.replace("/wiki/", variant)
            // @ts-ignore
            else if (k.href.startsWith(href) && k.hash) {
              // @ts-ignore
              k.href = "https://self.web.printer/" + k.hash.slice(1)
            }
          })
        }
      })
    },
    async onPageWillPrint({ page, pageInfo }) {
      pageInfo.title = await page.evaluate(
        `document.querySelector(".mw-page-title-main").innerText || document.title.replace(/ - .*$/, "")`
      )
    },
    injectStyle() {
      return {
        style,
        titleSelector: ".mw-page-title-main"
      }
    },
    otherParams() {
      return {
        hashIDSelector: "li[id*=cite_note], sup[id*=cite_ref], .mw-headline[id]"
      }
    }
  }
}
