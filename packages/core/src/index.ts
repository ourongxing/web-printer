import { chromium } from "playwright"
import { print } from "./print"
import type {
  PrinterPrintOption,
  PrinterOption,
  Plugin,
  PageInfoWithoutIndex
} from "./typings"
import { slog } from "./utils"

export { delay, delayBreak } from "./utils"
export * from "./typings"
export * from "./evaluate"
export * from "./fetch"

export class Printer {
  private contextOptions: PrinterOption
  constructor(options: PrinterOption = {}) {
    this.contextOptions = options
  }
  async login(url?: string) {
    const context = await chromium.launchPersistentContext(
      this.contextOptions.userDataDir ?? "userData",
      {
        ...this.contextOptions,
        headless: false
      }
    )
    const page = await context.newPage()
    url && (await page.goto(url))
    await page.pause()
  }
  use(plugin: Plugin) {
    const { contextOptions } = this
    const { outputDir, userDataDir, threads } = contextOptions
    const { fetchPagesInfo } = plugin
    return {
      async print(name: string, printOption: PrinterPrintOption = {}) {
        slog(`Fetching Pages Info...`)
        const context = await chromium.launchPersistentContext(
          userDataDir ?? "userData",
          {
            colorScheme: "light",
            ...contextOptions
          }
        )
        const { filter, reverse } = printOption
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

        if (reverse) {
          pagesInfo.reverse()
        }

        await print(name, pagesInfo, context, {
          threads: threads ?? 1,
          ...plugin,
          printOption,
          outputDir: outputDir ?? "output"
        })
      },
      async test(printOption: PrinterPrintOption = {}) {
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
