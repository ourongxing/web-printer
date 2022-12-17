import { describe, expect, test } from "vitest"
import juejing from "@web-printer/juejin"
import ruanyifeng from "@web-printer/ruanyifeng"
import xiaobot from "@web-printer/xiaobot"
import vitepress from "@web-printer/vitepress"
import javascriptInfo from "@web-printer/javascript-info"
import mdbook from "@web-printer/mdbook"
import zhubai from "@web-printer/zhubai"
import zhihui from "@web-printer/zhihu"
import { Printer } from "@web-printer/core"

describe(
  "print test",
  async () => {
    test.skip("print zhubai", async () => {
      await new Printer()
        .use(
          zhubai({
            url: "https://hsxg.zhubai.love/"
          })
        )
        .print("海上星光", {
          test: true
        })
    })
    test.skip("print xiaobot", async () => {
      await new Printer()
        .use(
          xiaobot({
            url: "https://xiaobot.net/p/pmthinking2022"
          })
        )
        .print("产品沉思录 | 2022", {
          test: true
        })
    })
    test.skip("print juejing", async () => {
      await new Printer({ threads: 10 })
        .use(
          juejing({
            url: "https://juejin.cn/?sort=three_days_hottest",
            maxPages: 50
          })
        )
        .print("掘金3日最热", {
          // test: true,
          continuous: true
        })
    })
    test.skip("print vitepress muiltiurl", async () => {
      await new Printer({ threads: 10 })
        .use(
          vitepress({
            url: {
              Guide: "https://vuejs.org/guide/introduction.html",
              API: "https://vuejs.org/api/application.html"
            }
          })
        )
        .print("Vue 3.2 Documentation", {
          // test: true,
          printBackground: true
        })
    })
    test("print vitepress", async () => {
      await new Printer({ threads: 10 })
        .use(
          vitepress({
            // url: {
            //   Guide: "https://cn.vitejs.dev/guide/",
            //   Config: "https://cn.vitejs.dev/config/"
            // }
            url: "https://ohmymn.marginnote.cn/guide/"
          })
        )
        .print("OhMyMN", {
          // test: true,
          printBackground: true,
          addPageNumber: true
          // continuous: true
        })
    })
    test.skip("print mdbook", async () => {
      await new Printer({ threads: 10 })
        .use(
          mdbook({
            url: "https://course.rs/first-try/hello-world.html"
          })
        )
        .print("Rust 真经", {
          // test: true,
          printBackground: true,
          continuous: true
        })
    })
    test.skip("print javascript info", async () => {
      await new Printer({ threads: 10 })
        .use(
          javascriptInfo({
            url: "https://javascript.info/"
          })
        )
        .print("Javascript Info", {
          // test: true,
          printBackground: true,
          continuous: true
        })
    })
    test.skip("print ruanyifeng weekly", async () => {
      await new Printer({ threads: 10 })
        .use(
          ruanyifeng({
            url: "https://www.ruanyifeng.com/blog/weekly/",
            removeWeeklyAds: true
          })
        )
        .print("科技爱好者周刊", {
          // filter: ({ index }) => index < 20,
          coverPath: "/Users/ourongxing/Downloads/node-images-to-pdf - npm.pdf",
          test: true,
          printBackground: true,
          continuous: true
        })
    })
    test.skip("print zhihu flow", async () => {
      await new Printer({ threads: 10 })
        .use(
          zhihui({
            // url: "https://www.zhihu.com/column/c_1183321146451267584",
            // url: "https://www.zhihu.com/column/collegephysics",
            url: "https://www.zhihu.com/collection/19561986",
            // url: "https://www.zhihu.com/collection/339120184",
            // url: "https://www.zhihu.com/collection/339120184",
            // url: "https://www.zhihu.com/collection/615801716",
            maxPages: 10
            // imgWaiting: 1000
          })
        )
        .print("知乎: 值得回头看几遍", {
          continuous: true
          // reverse: true,
          // test: true
        })
    })
    test.skip("print zhihu pagination", async () => {
      await new Printer({ threads: 10 })
        .use(
          zhihui({
            url: "https://www.zhihu.com/collection/822315776",
            maxPages: 10
          })
        )
        .print("知乎古言 HE", {
          continuous: true,
          test: true
        })
    })
  },
  { timeout: 1000 * 60 * 50 }
)
