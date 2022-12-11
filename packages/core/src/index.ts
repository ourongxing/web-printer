import { chromium } from "playwright"
import { print } from "./print"
import type {
  PrintOption,
  BrowserContextOptions,
  Plugin,
  PageInfoWithoutIndex
} from "./typings"
import { slog } from "./utils"

export { delay } from "./utils"
export * from "./typings"

export class Printer {
  private contextOptions: BrowserContextOptions
  constructor(options: BrowserContextOptions = {}) {
    this.contextOptions = options
  }
  async login() {
    await chromium.launchPersistentContext(
      this.contextOptions.userDataDir ?? "userData",
      {
        ...this.contextOptions,
        headless: false
      }
    )
  }
  use(plugin: Plugin) {
    const { beforePrint, fetchPagesInfo, injectStyle } = plugin
    const { contextOptions } = this
    const { outputDir, userDataDir, threads } = contextOptions
    return {
      async print(name: string, printOption: PrintOption = {}) {
        slog(`Fetching Pages Info...`)
        const context = await chromium.launchPersistentContext(
          userDataDir ?? "userData",
          {
            colorScheme: "light",
            ...contextOptions
          }
        )
        const { filter, margin, injectedStyle, continuous } = printOption
        let _pagesInfo: PageInfoWithoutIndex[] = []
        try {
          slog(`Fetching Pages Info...`)
          _pagesInfo = await fetchPagesInfo({ context })
        } catch (e) {
          slog("Fetch Filed")
          console.log(e)
          context.close()
          return
        }

        if (filter) {
          _pagesInfo = _pagesInfo.filter(
            (k, i) =>
              k.title &&
              filter({
                ...k,
                index: i,
                length: _pagesInfo.length
              })
          )
        }

        if (_pagesInfo.length === 0) {
          slog(`No Pages to Print`)
          context.close()
          return
        }

        const pagesInfo = _pagesInfo.map((k, index) => ({
          ...k,
          index
        }))

        if (injectStyle) {
          const { style, contentSelector, titleSelector } = await injectStyle()
          const top = typeof margin?.top === "number" ? margin.top : 60
          await print(name, pagesInfo, context, {
            threads: threads ?? 1,
            beforePrint,
            contentSelector,
            printOption: {
              ...printOption,
              injectedStyle: [
                style,
                injectedStyle,
                continuous &&
                  `${
                    titleSelector || "body"
                  } { margin-top: ${top}px !important; }`
              ]
                .flat()
                .filter(k => k)
            },
            outputDir: outputDir ?? "output"
          })
        } else {
          await print(name, pagesInfo, context, {
            threads: threads ?? 1,
            beforePrint,
            printOption,
            outputDir: outputDir ?? "output"
          })
        }
      },
      async test(printOption: PrintOption = {}) {
        const context = await chromium.launchPersistentContext(
          userDataDir ?? "userData",
          {
            ...contextOptions
          }
        )
        const { filter } = printOption
        let _pagesInfo: PageInfoWithoutIndex[] = []
        try {
          _pagesInfo = await fetchPagesInfo({ context })
        } catch (e) {
          console.log(e)
          context.close()
          return
        }

        if (filter) {
          _pagesInfo = _pagesInfo.filter(
            (k, i) =>
              k.title &&
              filter({
                ...k,
                index: i,
                length: _pagesInfo.length
              })
          )
        }

        if (_pagesInfo.length === 0) {
          slog(`No Pages to Print`)
          context.close()
          return
        }

        const pagesInfo = _pagesInfo.map((k, index) => ({
          ...k,
          index
        }))

        context.close()
        return { pagesInfo }
      }
    }
  }
}
