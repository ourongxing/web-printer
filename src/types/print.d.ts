interface CustomOption {
  /**
   * @default 5
   */
  thread?: number
  /**
   * collapse outline default
   * @default false
   */
  collapse?: boolean
  /**
   * 144 dpi better
   *
   * not shrink if undefined, will faster
   * @default undefined
   */
  quality?: number
}

export interface PrintOption extends CustomOption {
  /**
   * Display header and footer. Defaults to `false`.
   */
  displayHeaderFooter?: boolean

  /**
   * HTML template for the print footer. Should use the same format as the `headerTemplate`.
   */
  footerTemplate?: string

  /**
   * Paper format. If set, takes priority over `width` or `height` options. Defaults to 'Letter'.
   */
  format?: string

  /**
   * HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values
   * into them:
   * - `'date'` formatted print date
   * - `'title'` document title
   * - `'url'` document location
   * - `'pageNumber'` current page number
   * - `'totalPages'` total pages in the document
   */
  headerTemplate?: string

  /**
   * Paper height, accepts values labeled with units.
   */
  height?: string | number

  /**
   * Paper orientation. Defaults to `false`.
   */
  landscape?: boolean

  /**
   * Paper margins, defaults to none.
   */
  margin?: {
    /**
     * Top margin, accepts values labeled with units. Defaults to `0`.
     */
    top?: string | number

    /**
     * Right margin, accepts values labeled with units. Defaults to `0`.
     */
    right?: string | number

    /**
     * Bottom margin, accepts values labeled with units. Defaults to `0`.
     */
    bottom?: string | number

    /**
     * Left margin, accepts values labeled with units. Defaults to `0`.
     */
    left?: string | number
  }

  /**
   * Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
   */
  pageRanges?: string

  /**
   * The file path to save the PDF to. If `path` is a relative path, then it is resolved relative to the current working
   * directory. If no path is provided, the PDF won't be saved to the disk.
   */
  path?: string

  /**
   * Give any CSS `@page` size declared in the page priority over what is declared in `width` and `height` or `format`
   * options. Defaults to `false`, which will scale the content to fit the paper size.
   */
  preferCSSPageSize?: boolean

  /**
   * Print background graphics. Defaults to `false`.
   */
  printBackground?: boolean

  /**
   * Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
   */
  scale?: number

  /**
   * Paper width, accepts values labeled with units.
   */
  width?: string | number
}
