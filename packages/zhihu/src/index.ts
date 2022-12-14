import type { PageInfo, Plugin } from "@web-printer/core"
import { delay } from "@web-printer/core"
import { evaluateWaitForImgLoadLazy, scrollLoading } from "@web-printer/core"
import type { BrowserContext } from "playwright"

export default function (options: {
  /**
   * url of an article list page
   * @example
   * - "https://zhuanlan.zhihu.com/mactalk"
   * - "https://www.zhihu.com/collection/19561986"
   * - "https://www.zhihu.com/topic/20069728/top-answers"
   */
  url: string
  /**
   * when the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * when the artical list page have paginations, you can set threads to speed up fetch articals url.
   * @default 1
   */
  threads?: number
  /**
   * interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
  /**
   * waiting img and latex lazy loading
   * @default 500
   * @unit ms
   */
  imgWaiting?: number
}): Plugin {
  const {
    url,
    maxPages = Infinity,
    threads = 1,
    interval = 500,
    imgWaiting = 500
  } = options
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
        : await fetchPagination(context, url, threads, maxPages)
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
      const style = isZhuanlan
        ? `
        .Post-Title {
          font-size: 30px !important;
          margin-top: 0 !important;
          margin-bottom: 30px !important;
        }

        .Post-Header {
          width: 100% !important;
        }

        .Post-NormalMain>div {
          width: 100% !important;
          font-size: 20px !important;
        }

        html *{
          background: white;
        }

        .RichContent-actions,
        .Reward,
        .Post-topicsAndReviewer,
        .FollowButton,
        .RichContent-inner > div > div:not(.RichText) {
          display: none !important;
        } `
        : `
        .QuestionHeader-title {
          font-size: 30px !important;
          line-height: 1.5 !important;
          width: 100% !important;
        }

        .QuestionHeader {
          margin-bottom: 30px !important;
        }

        .RichText img {
            width: 80%;
            border-radius: 8px !important;
        }

        .QuestionHeader,
        .QuestionHeader-content,
        .QuestionHeader-main,
        .Card {
          box-shadow: none !important;
          width: 100% !important;
        }

        .Question-mainColumn,
        .Question-main {
        	width: 100% !important;
        	font-size: 20px !important;
        }

        html *{
          background: white;
        }

        .RichContent-actions,
        .ContentItem-actions,
        .Reward,
        .Post-topicsAndReviewer,
        .FollowButton,
        .MoreAnswers,
        .ViewAll,
        .RichContent-inner > div > div:not(.RichText) {
        	display: none !important;
        }
        `
      return {
        style,
        contentSelector: isZhuanlan
          ? ".Post-Main, #MathJax_SVG_glyphs"
          : ".QuestionHeader-title, .QuestionAnswer-content, #MathJax_SVG_glyphs"
      }
    }
  }
}

async function fetchFlow(
  context: BrowserContext,
  url: string,
  maxPages: number,
  interval: number
) {
  const page = await context.newPage()
  await page.goto(url, {
    waitUntil: "networkidle"
  })
  const fetchItemsNum = async () =>
    Number(
      await page.evaluate(`document.querySelectorAll(".ContentItem").length`)
    )
  await scrollLoading(page, fetchItemsNum, {
    interval,
    maxPages
  })
  const pagesInfo: PageInfo[] = JSON.parse(
    await page.evaluate(`
      (() => {
        const ret = [...document.querySelectorAll(".ContentItem-title a")].map(k=>({title: k.innerText, url:k.href}))
        return JSON.stringify(ret)
      })()
        `)
  )
  await page.close()
  return pagesInfo
}

async function fetchPagination(
  context: BrowserContext,
  url: string,
  threads: number,
  maxPages: number
) {
  url = url.replace(/\?.*$/, "")
  const page = await context.newPage()
  await page.goto(url, {
    waitUntil: "networkidle"
  })
  const n = Number(
    await page.evaluate(
      `(()=>{
        const buttons = document.querySelectorAll("div.Pagination > button:not([class*=next], [class*=prev])");
        if (buttons.length === 0) return 1;
        return buttons[buttons.length - 1].innerText
      })()
      `
    )
  )
  await page.close()
  const p = Array.from(
    { length: Math.min(Math.ceil(maxPages / 20) + 1, n) },
    (_, i) => i + 1
  )
  threads = Math.min(threads, p.length)
  const l = Math.ceil(p.length / threads)
  const pagesInfo = (
    await Promise.all(
      Array.from({ length: threads }, (_, i) => {
        return fetchThread(p.slice(i * l, (i + 1) * l))
      })
    )
  )
    .flat()
    .slice(0, maxPages)

  async function fetchThread(slice: number[]) {
    const ret: PageInfo[] = []
    const page = await context.newPage()
    for (const i of slice) {
      await page.goto(`${url}?page=${i}`)
      await page.goto(url, {
        waitUntil: "networkidle"
      })
      ret.push(
        ...JSON.parse(
          await page.evaluate(`
        (() => {
          const ret = [...document.querySelectorAll(".ContentItem-title a")].map(k=>({title: k.innerText, url:k.href}))
          return JSON.stringify(ret)
        })()
          `)
        )
      )
    }
    await page.close()
    return ret
  }

  return pagesInfo
}
