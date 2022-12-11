import { describe, expect, test } from "vitest"
import juejing from "@web-printer/juejin"
import ruanyifeng from "@web-printer/ruanyifeng"
import vitepress from "@web-printer/vitepress"
import mdbook from "@web-printer/mdbook"
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
            url: "https://juejin.cn/?sort=three_days_hottest"
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
      pagesInfo.forEach(pageInfo => {
        expect(pageInfo).toHaveProperty("title")
        expect(pageInfo).toHaveProperty("url")
      })
    })
    // test.skip("javascript info", async () => {
    //   const ret = await new Printer()
    //     .use(
    //       javascriptInfo({
    //       })
    //     )
    //     .test()
    //   expect(ret).toBeDefined()
    //   const { pagesInfo } = ret!
    //   expect(pagesInfo.length).greaterThanOrEqual(1)
    //   pagesInfo.forEach(pageInfo => {
    //     expect(pageInfo).toHaveProperty("title")
    //     expect(pageInfo).toHaveProperty("url")
    //   })
    // })
  },
  { timeout: 1000 * 60 * 5 }
)
