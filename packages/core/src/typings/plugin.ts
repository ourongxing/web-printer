import type { BrowserContext, Page } from "playwright"
import type { PageInfoWithoutIndex, PageInfo } from "."
import type { PrinterPrintOption } from "./options"
import type { MaybePromise } from "./utils"

export interface Plugin {
  /**
   * Used to fetch a list of page url and title, need return the list.
   */
  fetchPagesInfo(params: {
    context: BrowserContext
  }): MaybePromise<PageInfoWithoutIndex[]>
  /**
   * Used to remove distracting elements and make web pages more PDF-friendly.
   */
  injectStyle?(params: {
    url: string
    printOption: PrinterPrintOption
  }): MaybePromise<{
    style?: string
    /**
     * if given, printer will only print the content element.
     */
    contentSelector?: string
    /**
     * set top margin for it only.
     * @requires PrinterPrintOption.continuous = true
     * @default the first selector of contentSelector || "body"
     */
    titleSelector?: string
    /**
     * Avoid page break
     * @default "pre,blockquote,tbody tr"
     * @requires PrinterPrintOption.continuous = false
     */
    avoidBreakSelector?: string
  }>
  /**
   * Used to place other useful params.
   */
  otherParams?(params: {
    page: Page
    pageInfo: PageInfo
    printOption: PrinterPrintOption
  }): MaybePromise<{
    /**
     * Used for hash locating. If given, Printer could replace the hash of url to PDF position.
     * @default "h2[id],h3[id],h4[id],h5[id]" These elements use id to be located.
     * @requires PrinterPrintOption.replaceLink = true
     */
    hashIDSelector?: string
  }>
  /**
   * Run after page loaded.
   */
  onPageLoaded?(params: {
    page: Page
    pageInfo: PageInfo
    printOption: PrinterPrintOption
  }): MaybePromise<void>
  /**
   * Run before page will be printed.
   */
  onPageWillPrint?(params: {
    page: Page
    pageInfo: PageInfo
    printOption: PrinterPrintOption
  }): MaybePromise<void>
}
