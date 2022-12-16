import { describe, expect, test } from "vitest"
import juejing from "@web-printer/juejin"
import ruanyifeng from "@web-printer/ruanyifeng"
import vitepress from "@web-printer/vitepress"
import mdbook from "@web-printer/mdbook"
import zhubai from "@web-printer/zhubai"
import zhihui from "@web-printer/zhihu"
import javascriptInfo from "@web-printer/javascript-info"
import { Printer } from "@web-printer/core"

describe(
  "fetch pages info",
  async () => {
    test.skip("ruanyifeng", async () => {
      const ret = await new Printer()
        .use(
          ruanyifeng({
            url: "https://www.ruanyifeng.com/blog/developer/",
            removeWeeklyAds: true
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("juejin", async () => {
      const ret = await new Printer()
        .use(
          juejing({
            url: "https://juejin.cn/?sort=three_days_hottest",
            maxPages: 50
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      console.log(pagesInfo)
      console.log(pagesInfo.length)
      expect(pagesInfo.length).greaterThanOrEqual(1)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("vitepress", async () => {
      const ret = await new Printer()
        .use(
          vitepress({
            url: "https://cn.vitest.dev/guide/"
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("mdbook", async () => {
      const ret = await new Printer()
        .use(
          mdbook({
            url: "https://hellowac.github.io/mdbook_doc/index.html"
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      console.log(JSON.stringify(pagesInfo.slice(0, 2), undefined, 2))
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("javascript info", async () => {
      const ret = await new Printer()
        .use(
          javascriptInfo({
            url: "https://javascript.info/"
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      console.log(JSON.stringify(pagesInfo.slice(0, 2), undefined, 2))
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("zhubai", async () => {
      const ret = await new Printer()
        .use(
          zhubai({
            url: "https://hsxg.zhubai.love"
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      console.log(pagesInfo)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("zhihu", async () => {
      // await new Printer().login()
      // return
      const ret = await new Printer({ headless: false })
        .use(
          zhihui({
            url: "https://www.zhihu.com/collection/822315776",
            threads: 2
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      console.log(pagesInfo)
      console.log(pagesInfo.length)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    test.skip("zhihu flow", async () => {
      // await new Printer({
      //   channel: "msedge"
      // }).login()
      // return
      const ret = await new Printer({ headless: false })
        .use(
          zhihui({
            // url: "https://www.zhihu.com/column/ibagpa"
            // url: "https://www.zhihu.com/collection/40258902",
            // url: "https://www.zhihu.com/collection/339120184",
            // url: "https://www.zhihu.com/collection/86696007",
            url: "https://zhuanlan.zhihu.com/TheFutureofhumanity"
            // url: "https://www.zhihu.com/collection/615801716",
            // maxPages: 40
          })
        )
        .test()
      expect(ret).toBeDefined()
      const { pagesInfo } = ret!
      expect(pagesInfo.length).greaterThanOrEqual(1)
      console.log(pagesInfo)
      console.log(pagesInfo.length)
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
  },
  { timeout: 1000 * 60 * 5 }
)
