import { describe, expect, test } from "vitest"
import juejing from "@web-printer/juejin"
import ruanyifeng from "@web-printer/ruanyifeng"
import vitepress from "@web-printer/vitepress"
import javascriptInfo from "@web-printer/javascript-info"
import mdbook from "@web-printer/mdbook"
import zhubai from "@web-printer/zhubai"
import { Plugin, Printer } from "@web-printer/core"

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
    test.skip("print juejing", async () => {
      await new Printer({ threads: 10 })
        .use(
          juejing({
            url: "https://juejin.cn/?sort=three_days_hottest"
          })
        )
        .print("掘金", {
          test: true,
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
          test: true,
          printBackground: true
        })
    })
    test.skip("print vitepress", async () => {
      await new Printer()
        .use(
          vitepress({
            url: "https://vitepress.vuejs.org/guide/getting-started"
          })
        )
        .print("Vitepress", {
          test: true,
          printBackground: true
        })
    })
    test.skip("print mdbook", async () => {
      await new Printer({ threads: 10 })
        .use(
          mdbook({
            url: "https://hellowac.github.io/mdbook_doc/index.html"
          })
        )
        .print("rust", {
          test: true,
          printBackground: true,
          continuous: true
        })
    })
    test("print javascript info", async () => {
      await new Printer({ threads: 10 })
        .use(
          javascriptInfo({
            url: "https://zh.javascript.info/"
          })
        )
        .print("Javascript Info", {
          test: true,
          printBackground: true,
          continuous: true
        })
    })
  },
  { timeout: 1000 * 60 * 50 }
)
