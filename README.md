<br>

<p align="center">
  <img src="./assets/printer@256.png" style="width:200px;" />
</p>

<h1 align="center">Web Printer</h1>

<p align="center">
<span>
A printer that can print multiple web pages as one pretty PDF
</span>
<br/>
<b>with outlines, without distractions</b>
<br/>
<b>and learn in depth</b>
<br/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-blue" alt="language">
  <a href="https://www.npmjs.com/package/@web-printer/core"><img src="https://img.shields.io/badge/v0.2.5-EE2C50" alt="version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/MIT-yellow" alt="license"></a>
</p>


<p align="center">
<span>💡 Try to study in <a href="https://apps.apple.com/tw/app/marginnote-3/id1348317163?platform=ipad">MarginNote</a> !</span>
</p>

## Features

Use [Playwright](https://github.com/microsoft/playwright) to print PDF, just like printing in Chrome, but print multiple web pages as one pretty pdf automatically.

- Fully customizable, it's just a nodejs library.
- Universality, supports any websites by plugins.
- Amazing, replace website inner links to PDF inner links, supports hash positioning.
- Auto generate outlines of PDF, supports different level and collapsed status.
- Easy to remove distracting elements. No distractions, only pure knowledge.

## Installation

> **Warning**
>
> Web Printer just a nodejs library instead of an application. If you are a novice of Nodejs/TypeScript/JavaScript, Web Printer may be difficult for you to use. Welcome to contribute an application to easy use if you are free.

If you are not a novice, do what you want to do, just like install a npm package.

```bash
pnpm i playwright @web-printer/core
pnpm exec playwright install chromium
# plugin you need
pnpm i @web-printer/javascript-info
```

Then create a `.ts` file, input

```ts
import { Printer } from "@web-printer/core"
// import plugin you install
import javascriptInfo from "@web-printer/javascript-info"

new Printer()
  .use(
    javascriptInfo({
      url: "https://javascript.info/"
    })
  )
  .print("The Modern JavaScript Tutorial")
```

And run it by [tsx](https://github.com/esbuild-kit/tsx), in other ways may throw errors. I have no time to fix it now.

But if you are a novice, follow me, maybe easier.

First you shoud install [pnpm(with node)](https://pnpm.io/installation), [vscode(support typescript)](https://code.visualstudio.com/).

```bash
pnpm create printer@latest

# or complete in one step
pnpm create printer@latest web-printer -p vitepress
```

And follow the tips. After customizing, use `pnpm print` to print. A pretty PDF will appear in `./output`.

## Options

The [@web-printer/core](https://github.com/busiyiworld/web-printer/tree/main/packages/core) provide a Printer object, some types and some utilities.

```ts
import { Printer, type Plugin } from "@web-printer/core"
import type { Plugin, PrinterOption, PrinterPrintOption } from "@web-printer/core"

new Printer({} as PrinterOption)
  .use({} as Plugin)
  .print("PDF name", {} as PrinterPrintOption )
```

`PrinterOption` extends Playwright `browserType.launchPersistentContext` [options](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).

```ts
{
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
```

`PrinterPrintOption` extends Playwright `page.pdf()` [options](https://playwright.dev/docs/api/class-page#page-pdf).

```ts
{
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
   * If the outline has different levels, outline may be confused.
   */
  reverse?: boolean
  /**
   * A local cover pdf path.
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
   * Replace website link to PDF link
   * @default false
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
  format?: "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "Legal" | "Letter" | "Tabloid"
}
```

## Plugins

Plugins in Web Printer is only used to adapt to different websites.

A plugin have five methods:

- `fetchPagesInfo`: Used to fetch a list of page url and title, need return the list.
- `injectStyle`: Used to remove distracting elements and make web pages more PDF-friendly.
- `onPageLoaded`: Run after page loaded.
- `onPageWillPrint`: Run before page will be printed.
- `otherParams`: Used to place other useful params.

### Offical plugins

- Content Site
  - [@web-printer/javascript-info](https://github.com/busiyiworld/web-printer/tree/main/packages/javascript-info)
  - [@web-printer/juejin](https://github.com/busiyiworld/web-printer/tree/main/packages/juejin)
  - [@web-printer/xiaobot](https://github.com/busiyiworld/web-printer/tree/main/packages/xiaobot)
  - [@web-printer/zhihu](https://github.com/busiyiworld/web-printer/tree/main/packages/zhihu)
  - [@web-printer/zhubai](https://github.com/busiyiworld/web-printer/tree/main/packages/zhubai)
  - [@web-printer/wikipedia](https://github.com/busiyiworld/web-printer/tree/main/packages/wikipedia)
- Amazing Blog
  - [@web-printer/ruanyifeng](https://github.com/busiyiworld/web-printer/tree/main/packages/ruanyifeng)
- Documentation Site Generator
  - [@web-printer/vitepress](https://github.com/busiyiworld/web-printer/tree/main/packages/vitepress)
  - [@web-printer/mdbook](https://github.com/busiyiworld/web-printer/tree/main/packages/mdbook)

### How to write a plugin

In fact, it is just use [Playwright](https://playwright.dev/docs/library) to inject JS and CSS into the page. You can read the code of offical plugins to learn how to write a plugin. It's pretty simple most of the time.

*Let's make some rules*

- Use a  function to return a plugin.
- The function parameter is an options object.
- If the number of pages info to be fetched is large and fetched slow, you need to provide the `maxPages` option, especially endless loading.

#### fetchPagesInfo

Used to fetch a list of page url and title, need return the list. Usually need to parse sidebar outline. Web Printer could restore the hierarchy and collapsed state of the original outline perfectly.

```typescript
type fetchPagesInfo = (params: {context: BrowserContext}) => MaybePromise<PageInfoWithoutIndex[]>
interface PageInfoWithoutIndex {
  url: string
  title: string
  /**
  * Outer ... Inner
  */
  groups?: (
    | {
        name: string
        collapsed?: boolean
      }
    | string
  )[]
  /**
   * When this item is a group but have a link and content.
   */
  selfGroup?: boolean
  collapsed?: boolean
}
```

The pageInfo need returned just like

```ts
// https://javascript.info/
[
  {
    title: "Manuals and specifications",
    url: "https://javascript.info/manuals-specifications",
    groups: [
      {
        name: "The JavaScript language"
      },
      {
        name: "An introduction"
      }
    ]
  },
  ...
]
```

*Examples*

- simple outline: [javascript-info/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/javascript-info/src/index.ts#L18-L52)
- complex outline: [mdbook/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/mdbook/src/index.ts#L17-L93)
- scroll loading: [juejin/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/juejin/src/index.ts#L31-L54)

- pagination: [zhihu/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/zhihu/src/index.ts#L183-L245)

#### injectStyle

Used to remove distracting elements and make web pages more PDF-friendly.

```ts
type injectStyle = (params: { url: string; printOption: PrinterPrintOption }): MaybePromise<{
  style?: string
  contentSelector?: string
  titleSelector?: string
  avoidBreakSelector?: string
}>
```

*Let's make some rules*:

- Hide all elements but content.
- Set the margin of the content element and it's ancestor elements to zero.

Therefore, everyone can set the same margin for any website.

Don't worry, It's so easy. You only need to provide a `contentSelector` , support [selector list](https://developer.mozilla.org/en-US/docs/Web/CSS/Selector_list). Web Printer can hide all elements but it and make the margin of it and it's ancestor elements zero automatically.

But not all websites can do this, sometimes you still need to write CSS yourself, just return the `style` property.

When you set `PrinterPrintOption.continuous` to `true`.  Web Printer will set the top and bottom margins of all pages except the first page of each artical to zero.

The `titleSelector` is used to mark the title element, and set top margin for it only. The default value is same as `contentSelector` if `contentSelector` is not empty. And If `contentSelector` has `,`, Printer will use the first selector. If `titleSelector` and `contentSelector` are both empty, the default value will be `body`, but sometimes setting margin top for the body may result in extra white space.

The `avoidBreakSelector` is used to avoid page breaks in certain elements. The default value is `pre,blockquote,tbody tr`
#### onPageLoades

Run after page loaded. Usually used to wait img loaded, especially lazy loaded images.

```ts
type onPageLoaded = (params: { page: Page; pageInfo: PageInfo; printOption: PrinterPrintOption }): MaybePromise<void>
```

Web Printer provide two methods to handle image loading:

-  ```ts
   type evaluateWaitForImgLoad = (page: Page, imgSelector = "img"): Promise<void>
   ```

- ```ts
  type evaluateWaitForImgLoadLazy = ( page: Page, imgSelector = "img", waitingTime = 200 ): Promise<void>
  ```

#### onPageWillPrint

Run before page will be printed.

 ```ts
 type onPageWillPrint = (params: { page: Page; pageInfo: PageInfo; printOption: PrinterPrintOption }): MaybePromise<void>
 ```

### otherParams

Used to place other useful params.

```ts
 type otherParams = (params: { page: Page; pageInfo: PageInfo; printOption: PrinterPrintOption }): MaybePromise<{
  hashIDSelector: string
 }>
```

In some sites, such as Wikipedia or some knowledge base, like to use a hash id to jump to the specified element, is the use of this element's id. If you give the `hashIDSelector` and `PrinterPrintOption.replaceLink` is `true`, Printer could replace the hash of url to PDF position. The default value is `h2[id],h3[id],h4[id],h5[id]`.


## Shrink PDF

PDF generated by Web Printer maybe need to be shrinked in size by yourself.

## Acknowledgements

- [microsoft/playwright](https://github.com/microsoft/playwright)
- [Hopding/pdf-lib](https://github.com/Hopding/pdf-lib)
- [lillallol/outline-pdf](https://github.com/lillallol/outline-pdf)
## License

<a href="./LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>