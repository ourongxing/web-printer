import type { BrowserContextOptions, PrintOption } from "./playwright"
import type { PageFilter } from "."

export interface PrinterPrintOption extends PrintOption {
  /**
   * Make a test print, only print two pages and name will be appended "test: "
   * @default false
   */
  test?: boolean
  /**
   * Filter the pages you want
   */
  filter?: PageFilter
  /**
   * Reverse the printing order.
   *
   * If the outline has different levels, outline may be confused.
   */
  reverse?: boolean
  /**
   * A local cover pdf path.
   *
   * Maybe you can use it to marge exist pdf, but can't merge outlines.
   */
  coverPath?: string
  /**
   * inject additonal css
   */
  style?: string | (false | undefined | string)[]
  /**
   * Set the top and bottom margins of all pages except the first page of each artical to zero.
   * @default false
   */
  continuous?: boolean
  /**
   * Replace website link to PDF link, not support hash url
   * @default true
   */
  replaceLink?: boolean
  /**
   * Add page numbers to the bottom center of the page.
   * @default false
   * @requires PrinterPrintOption.continuous = false
   */
  addPageNumber?: boolean
  /**
   * Margins of each page
   * @default
   * {
   *    top: 60,
   *    right: 55,
   *    bottom: 60,
   *    left: 55,
   * }
   */
  margin?: {
    /**
     * @default 60
     */
    top?: string | number
    /**
     * @default 55
     */
    right?: string | number

    /**
     * @default 60
     */
    bottom?: string | number
    /**
     * @default 55
     */
    left?: string | number
  }
  /**
   * Paper format. If set, takes priority over `width` or `height` options.
   * @defaults "A4"
   */
  format?:
    | "A0"
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "Legal"
    | "Letter"
    | "Tabloid"
}

export interface PrinterOption extends BrowserContextOptions {
  /**
   * Dir of userdata of Chromium
   * @default "./userData"
   */
  userDataDir?: string
  /**
   * Dir of output pdfs
   * @default "./output"
   */
  outputDir?: string
  /**
   * Number of threads to print, will speed up printing.
   * @default 1
   */
  threads?: number
}
