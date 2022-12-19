import type { Plugin } from "@web-printer/core"
import { delay, evaluateWaitForImgLoadLazy } from "@web-printer/core"
import { fetchFlow, fetchPagination } from "./fetch"
import { styleAnswer, styleZhuanlan } from "./style"

export default function (options: {
  /**
   * Url of an article list page
   * @example
   * - "https://zhuanlan.zhihu.com/mactalk"
   * - "https://www.zhihu.com/collection/19561986"
   * - "https://www.zhihu.com/topic/20069728/top-answers"
   */
  url: string
  /**
   * When the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * Interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
  /**
   * Waiting img and latex lazy loading
   * @default 500
   * @unit ms
   */
  imgWaiting?: number
}): Plugin {
  const { url, maxPages = Infinity, interval = 500, imgWaiting = 500 } = options
  if (!url) throw new Error("url is required")
  return {
    async fetchPagesInfo({ context }) {
      const isFlow = [
        /zhihu\.com\/column/,
        /zhihu\.com\/topic/,
        /zhuanlan\.zhihu\.com\/.+/
      ].some(k => k.test(url))
      const isPagination = [/zhihu\.com\/collection/].some(k => k.test(url))
      if (!isFlow && !isPagination) throw new Error("url is not supported")
      const pagesInfo = isFlow
        ? await fetchFlow(context, url, maxPages, interval)
        : await fetchPagination(context, url, maxPages)
      return pagesInfo
    },
    async onPageLoaded({ page }) {
      await delay(500)
      await evaluateWaitForImgLoadLazy(
        page,
        ".RichText img, .ztext-math",
        imgWaiting
      )
    },
    injectStyle({ url }) {
      const isZhuanlan = url.includes("zhuanlan.zhihu")
      const style = isZhuanlan ? styleZhuanlan : styleAnswer
      return {
        style,
        contentSelector: isZhuanlan
          ? ".Post-Main, #MathJax_SVG_glyphs"
          : ".QuestionHeader-title, .QuestionAnswer-content, #MathJax_SVG_glyphs"
      }
    }
  }
}
