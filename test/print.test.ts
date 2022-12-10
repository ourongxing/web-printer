import { describe, expect, test } from "vitest"
import juejing from "@web-printer/juejin"
import ruanyifeng from "@web-printer/ruanyifeng"
import vitepress from "@web-printer/vitepress"
import javascriptInfo from "@web-printer/javascript-info"
import mdbook from "@web-printer/mdbook"
import { Printer } from "@web-printer/core"

describe(
  "print test",
  async () => {
    test.skip("print juejing", async () => {
      await new Printer()
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
    test.skip("print vitepress", async () => {
      await new Printer()
        .use(
          vitepress({
            url: "https://vitepress.vuejs.org/guide/deploying"
          })
        )
        .print("vitepress", {
          test: true,
          printBackground: true,
          continuous: true
        })
    })
    test.skip("print mdbook", async () => {
      await new Printer()
        .use(
          mdbook({
            url: "https://hellowac.github.io/mdbook_doc/index.html"
          })
        )
        .print("rust", {
          test: true,
          printBackground: true
          // continuous: true
        })
    })
    test.skip("print javascript info", async () => {
      await new Printer({ threads: 10 })
        .use(
          javascriptInfo({
            lang: "EN"
          })
        )
        .print("Javascript", {
          test: true,
          printBackground: true,
          continuous: true
        })
    })
  },
  { timeout: 1000 * 60 * 5 }
)
