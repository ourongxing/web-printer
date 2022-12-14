import type { BrowserContextOptions as _option } from "playwright"
import type { PageFilter } from "."

interface WebPrinterPrintOption {
  filter?: PageFilter
  reverse?: boolean
  coverPath?: string
  test?: boolean
  collapsed?: boolean
  injectedStyle?: string | (false | undefined | string)[]
  continuous?: boolean
}

export interface PrintOption extends WebPrinterPrintOption {
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
   * Paper margins
   */
  margin?: {
    /**
     * Top margin, accepts values labeled with units. Defaults to `60`.
     */
    top?: string | number

    /**
     * Right margin, accepts values labeled with units. Defaults to `60`.
     */
    right?: string | number

    /**
     * Bottom margin, accepts values labeled with units. Defaults to `60`.
     */
    bottom?: string | number

    /**
     * Left margin, accepts values labeled with units. Defaults to `60`.
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

export interface WebPrinterBrowserContextOptions {
  userDataDir?: string
  outputDir?: string
  threads?: number
}

export interface BrowserContextOptions extends WebPrinterBrowserContextOptions {
  /**
   * Whether to automatically download all the attachments. Defaults to `true` where all the downloads are accepted.
   */
  acceptDownloads?: boolean

  /**
   * Additional arguments to pass to the browser instance. The list of Chromium flags can be found
   * [here](http://peter.sh/experiments/chromium-command-line-switches/).
   */
  args?: Array<string>

  /**
   * When using [page.goto(url[, options])](https://playwright.dev/docs/api/class-page#page-goto),
   * [page.route(url, handler[, options])](https://playwright.dev/docs/api/class-page#page-route),
   * [page.waitForURL(url[, options])](https://playwright.dev/docs/api/class-page#page-wait-for-url),
   * [page.waitForRequest(urlOrPredicate[, options])](https://playwright.dev/docs/api/class-page#page-wait-for-request), or
   * [page.waitForResponse(urlOrPredicate[, options])](https://playwright.dev/docs/api/class-page#page-wait-for-response) it
   * takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
   * constructor for building the corresponding URL. Examples:
   * - baseURL: `http://localhost:3000` and navigating to `/bar.html` results in `http://localhost:3000/bar.html`
   * - baseURL: `http://localhost:3000/foo/` and navigating to `./bar.html` results in `http://localhost:3000/foo/bar.html`
   * - baseURL: `http://localhost:3000/foo` (without trailing slash) and navigating to `./bar.html` results in
   *   `http://localhost:3000/bar.html`
   */
  baseURL?: string

  /**
   * Toggles bypassing page's Content-Security-Policy.
   */
  bypassCSP?: boolean

  /**
   * Browser distribution channel.  Supported values are "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge",
   * "msedge-beta", "msedge-dev", "msedge-canary". Read more about using
   * [Google Chrome and Microsoft Edge](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge).
   */
  channel?: string

  /**
   * Enable Chromium sandboxing. Defaults to `false`.
   */
  chromiumSandbox?: boolean

  /**
   * Emulates `'prefers-colors-scheme'` media feature, supported values are `'light'`, `'dark'`, `'no-preference'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details. Passing
   * `null` resets emulation to system defaults. Defaults to `'light'`.
   */
  colorScheme?: null | "light" | "dark" | "no-preference"

  /**
   * Specify device scale factor (can be thought of as dpr). Defaults to `1`.
   */
  deviceScaleFactor?: number

  /**
   * **Chromium-only** Whether to auto-open a Developer Tools panel for each tab. If this option is `true`, the `headless`
   * option will be set `false`.
   */
  devtools?: boolean

  /**
   * If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is
   * deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in
   * is closed.
   */
  downloadsPath?: string

  /**
   * Specify environment variables that will be visible to the browser. Defaults to `process.env`.
   */
  env?: { [key: string]: string | number | boolean }

  /**
   * Path to a browser executable to run instead of the bundled one. If `executablePath` is a relative path, then it is
   * resolved relative to the current working directory. Note that Playwright only works with the bundled Chromium, Firefox
   * or WebKit, use at your own risk.
   */
  executablePath?: string

  /**
   * An object containing additional HTTP headers to be sent with every request.
   */
  extraHTTPHeaders?: { [key: string]: string }

  /**
   * Emulates `'forced-colors'` media feature, supported values are `'active'`, `'none'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details. Passing
   * `null` resets emulation to system defaults. Defaults to `'none'`.
   */
  forcedColors?: null | "active" | "none"

  geolocation?: {
    /**
     * Latitude between -90 and 90.
     */
    latitude: number

    /**
     * Longitude between -180 and 180.
     */
    longitude: number

    /**
     * Non-negative accuracy value. Defaults to `0`.
     */
    accuracy?: number
  }

  /**
   * Close the browser process on SIGHUP. Defaults to `true`.
   */
  handleSIGHUP?: boolean

  /**
   * Close the browser process on Ctrl-C. Defaults to `true`.
   */
  handleSIGINT?: boolean

  /**
   * Close the browser process on SIGTERM. Defaults to `true`.
   */
  handleSIGTERM?: boolean

  /**
   * Specifies if viewport supports touch events. Defaults to false.
   */
  hasTouch?: boolean

  /**
   * Whether to run browser in headless mode. More details for
   * [Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) and
   * [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode). Defaults to `true` unless the
   * `devtools` option is `true`.
   */
  headless?: boolean

  /**
   * Credentials for [HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).
   */
  httpCredentials?: {
    username: string

    password: string
  }

  /**
   * If `true`, Playwright does not pass its own configurations args and only uses the ones from `args`. If an array is
   * given, then filters out the given default arguments. Dangerous option; use with care. Defaults to `false`.
   */
  ignoreDefaultArgs?: boolean | Array<string>

  /**
   * Whether to ignore HTTPS errors when sending network requests. Defaults to `false`.
   */
  ignoreHTTPSErrors?: boolean

  /**
   * Whether the `meta viewport` tag is taken into account and touch events are enabled. Defaults to `false`. Not supported
   * in Firefox.
   */
  isMobile?: boolean

  /**
   * Whether or not to enable JavaScript in the context. Defaults to `true`.
   */
  javaScriptEnabled?: boolean

  /**
   * Specify user locale, for example `en-GB`, `de-DE`, etc. Locale will affect `navigator.language` value, `Accept-Language`
   * request header value as well as number and date formatting rules.
   */
  locale?: string

  /**
   * Logger sink for Playwright logging.
   */
  // logger?: Logger

  /**
   * Whether to emulate network being offline. Defaults to `false`.
   */
  offline?: boolean

  /**
   * A list of permissions to grant to all pages in this context. See
   * [browserContext.grantPermissions(permissions[, options])](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions)
   * for more details.
   */
  permissions?: Array<string>

  /**
   * Network proxy settings.
   */
  proxy?: {
    /**
     * Proxy to be used for all requests. HTTP and SOCKS proxies are supported, for example `http://myproxy.com:3128` or
     * `socks5://myproxy.com:3128`. Short form `myproxy.com:3128` is considered an HTTP proxy.
     */
    server: string

    /**
     * Optional comma-separated domains to bypass proxy, for example `".com, chromium.org, .domain.com"`.
     */
    bypass?: string

    /**
     * Optional username to use if HTTP proxy requires authentication.
     */
    username?: string

    /**
     * Optional password to use if HTTP proxy requires authentication.
     */
    password?: string
  }

  /**
   * Enables [HAR](http://www.softwareishard.com/blog/har-12-spec) recording for all pages into `recordHar.path` file. If not
   * specified, the HAR is not recorded. Make sure to await
   * [browserContext.close()](https://playwright.dev/docs/api/class-browsercontext#browser-context-close) for the HAR to be
   * saved.
   */
  recordHar?: {
    /**
     * Optional setting to control whether to omit request content from the HAR. Defaults to `false`. Deprecated, use `content`
     * policy instead.
     */
    omitContent?: boolean

    /**
     * Optional setting to control resource content management. If `omit` is specified, content is not persisted. If `attach`
     * is specified, resources are persisted as separate files or entries in the ZIP archive. If `embed` is specified, content
     * is stored inline the HAR file as per HAR specification. Defaults to `attach` for `.zip` output files and to `embed` for
     * all other file extensions.
     */
    content?: "omit" | "embed" | "attach"

    /**
     * Path on the filesystem to write the HAR file to. If the file name ends with `.zip`, `content: 'attach'` is used by
     * default.
     */
    path: string

    /**
     * When set to `minimal`, only record information necessary for routing from HAR. This omits sizes, timing, page, cookies,
     * security and other types of HAR information that are not used when replaying from HAR. Defaults to `full`.
     */
    mode?: "full" | "minimal"

    /**
     * A glob or regex pattern to filter requests that are stored in the HAR. When a `baseURL` via the context options was
     * provided and the passed URL is a path, it gets merged via the
     * [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor.
     */
    urlFilter?: string | RegExp
  }

  /**
   * Enables video recording for all pages into `recordVideo.dir` directory. If not specified videos are not recorded. Make
   * sure to await [browserContext.close()](https://playwright.dev/docs/api/class-browsercontext#browser-context-close) for
   * videos to be saved.
   */
  recordVideo?: {
    /**
     * Path to the directory to put videos into.
     */
    dir: string

    /**
     * Optional dimensions of the recorded videos. If not specified the size will be equal to `viewport` scaled down to fit
     * into 800x800. If `viewport` is not configured explicitly the video size defaults to 800x450. Actual picture of each page
     * will be scaled down if necessary to fit the specified size.
     */
    size?: {
      /**
       * Video frame width.
       */
      width: number

      /**
       * Video frame height.
       */
      height: number
    }
  }

  /**
   * Emulates `'prefers-reduced-motion'` media feature, supported values are `'reduce'`, `'no-preference'`. See
   * [page.emulateMedia([options])](https://playwright.dev/docs/api/class-page#page-emulate-media) for more details. Passing
   * `null` resets emulation to system defaults. Defaults to `'no-preference'`.
   */
  reducedMotion?: null | "reduce" | "no-preference"

  /**
   * Emulates consistent window screen size available inside web page via `window.screen`. Is only used when the `viewport`
   * is set.
   */
  screen?: {
    /**
     * page width in pixels.
     */
    width: number

    /**
     * page height in pixels.
     */
    height: number
  }

  /**
   * Whether to allow sites to register Service workers. Defaults to `'allow'`.
   * - `'allow'`: [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) can be registered.
   * - `'block'`: Playwright will block all registration of Service Workers.
   */
  serviceWorkers?: "allow" | "block"

  /**
   * Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on.
   */
  slowMo?: number

  /**
   * If specified, enables strict selectors mode for this context. In the strict selectors mode all operations on selectors
   * that imply single target DOM element will throw when more than one element matches the selector. See [Locator] to learn
   * more about the strict mode.
   */
  strictSelectors?: boolean

  /**
   * Maximum time in milliseconds to wait for the browser instance to start. Defaults to `30000` (30 seconds). Pass `0` to
   * disable timeout.
   */
  timeout?: number

  /**
   * Changes the timezone of the context. See
   * [ICU's metaZones.txt](https://cs.chromium.org/chromium/src/third_party/icu/source/data/misc/metaZones.txt?rcl=faee8bc70570192d82d2978a71e2a615788597d1)
   * for a list of supported timezone IDs.
   */
  timezoneId?: string

  /**
   * If specified, traces are saved into this directory.
   */
  tracesDir?: string

  /**
   * Specific user agent to use in this context.
   */
  userAgent?: string

  /**
   * **DEPRECATED** Use `recordVideo` instead.
   * @deprecated
   */
  videoSize?: {
    /**
     * Video frame width.
     */
    width: number

    /**
     * Video frame height.
     */
    height: number
  }

  /**
   * **DEPRECATED** Use `recordVideo` instead.
   * @deprecated
   */
  videosPath?: string

  /**
   * Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. `null` disables the default viewport.
   */
  viewport?: null | {
    /**
     * page width in pixels.
     */
    width: number

    /**
     * page height in pixels.
     */
    height: number
  }
}
