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
<b>and learn in deepth</b>
<br/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-blue" alt="language">
  <a href="https://www.npmjs.com/package/@web-printer/core"><img src="https://img.shields.io/badge/v0.2.3-EE2C50" alt="version"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/MIT-yellow" alt="license"></a>
</p>


<p align="center">
<span>💡 Try to study in <a href="https://apps.apple.com/tw/app/marginnote-3/id1348317163?platform=ipad">MarginNote</a> !</span>
</p>

## Features

Use [Playwright](https://github.com/microsoft/playwright) to print PDF, just like printing in Chrome, but print multiple web pages as one pretty pdf automatically.

- Fully customizable, it's just a nodejs library.
- Universality, supports any websites by plugins.
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

But if you are a novice, follow me, maybe easier.

First you shoud install [pnpm(with node)](https://pnpm.io/installation), [vscode(support typescript)](https://code.visualstudio.com/).

```bash
# create a web-printer project
pnpm create printer@latest

# enter the project
cd name_of_project_you_set

# maybe slowly if you're in China
pnpm i & pnpm pw install chromium

# open project in vscode, try to edit the src/index.ts
code .
```

After customizing, use `pnpm print` to print. A pretty PDF will appear in `./output`.

## Configurations

### Core

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

`PrinterPrintOption` extends Playwright `page.pdf() ` [options]([Page | Playwright](https://playwright.dev/docs/api/class-page#page-pdf)).

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
   * A local cover pdf path
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
   * Margins of each page
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
}
```

### Plugins

Plugins in Web Printer is only used to adapt to different websites.

A plugin have four methods:

- `fetchPagesInfo`: Used to fetch a list of page url and title, need return the list.
- `injectStyle`: Used to remove distracting elements and make web pages more PDF-friendly.
- `onPageLoaded`: Run after page loaded.
- `onPageWillPrint`: Run before page will be printed.

#### Offical plugins

- Content Site

  - [@web-printer/javascript-info](https://github.com/busiyiworld/web-printer/tree/main/packages/javascript-info)

  - [@web-printer/juejin](https://github.com/busiyiworld/web-printer/tree/main/packages/juejin)

  - [@web-printer/xiaobot](https://github.com/busiyiworld/web-printer/tree/main/packages/xiaobot)

  - [@web-printer/zhihu](https://github.com/busiyiworld/web-printer/tree/main/packages/zhihu)

  - [@web-printer/zhubai](https://github.com/busiyiworld/web-printer/tree/main/packages/zhubai)
- Amazing Blog
  - [@web-printer/ruanyifeng](https://github.com/busiyiworld/web-printer/tree/main/packages/ruanyifeng)
- Documentation Site Generator
  - [@web-printer/vitepress](https://github.com/busiyiworld/web-printer/tree/main/packages/vitepress)
  - [@web-printer/mdbook](https://github.com/busiyiworld/web-printer/tree/main/packages/mdbook)

#### How to write a plugin

In fact, it is just use [Playwright](https://playwright.dev/docs/library) to inject JS and CSS into the page. You can read the code of offical plugins to learn how to write a plugin. It's pretty simple most of the time.

**Let's make some rules**

- Use a  function to return a plugin.
- The function parameter is an options object.
- If the number of pages info to be fetched is large and fetched slow, you need to provide the `maxPages` option, especially endless loading.

##### fetchPagesInfo

Used to fetch a list of page url and title, need return the list. Usually need to parse sidebar outline. Web Printer could restores the hierarchy and collapsed state of the original outline perfectly.

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

**Examples**

- simple outline: [javascript-info/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/javascript-info/src/index.ts#L18-L52)
- complex outline: [mdbook/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/mdbook/src/index.ts#L17-L93)
- scroll loading: [juejin/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/juejin/src/index.ts#L31-L54)

- pagination: [zhihu/src/index.ts](https://github.com/busiyiworld/web-printer/blob/main/packages/zhihu/src/index.ts#L183-L245)

##### injectStyle

Used to remove distracting elements and make web pages more PDF-friendly.

```ts
type injectStyle = (params: { url: string }): MaybePromise<{
  style?: string
  contentSelector?: string
  titleSelector?: string
}>
```

**Let's make some rules**:

- Hide all elements but content.
- Make the margin of the content element and it's ancestor elements zero.

Therefore, everyone can set the same margin for any website.

Don't worry, It's so easy. You only need to provide a `contentSelector` , support [selector list](https://developer.mozilla.org/en-US/docs/Web/CSS/Selector_list). Web Printer can hide all elements but it and make the margin of it and it's ancestor elements zero automatically. You can use

But not all websites can do this, sometimes you still need to write CSS yourself, just return the `style` property.

When you set `PrinterPrintOption.continuous` to `true`.  Web Printer will set the top and bottom margins of all pages except the first page of each artical to zero.

The `titleSelector` is used to mark the title element, The default value is `body`. Most sites don't need to provide the `titleSelector`.

##### onPageLoades

Run after page loaded. Usually used to wait img loaded, especially lazy loaded images.

```ts
type onPageLoaded = (params: { page: Page; pageInfo: PageInfo }): MaybePromise<void>
```

Web Printer provide two methods to handle image loading:

-  ```ts
   type evaluateWaitForImgLoad = (page: Page, imgSelector = "img"): Promise<void>
   ```

- ```ts
  type evaluateWaitForImgLoadLazy = ( page: Page, imgSelector = "img", waitingTime = 200 ): Promise<void>
  ```

##### onPageWillPrint

Run before page will be printed.

 ```ts
 type onPageWillPrint = (params: { page: Page; pageInfo: PageInfo }): MaybePromise<void>
 ```

## Shrink PDF

PDF generated by Web Printer maybe need to be shrinked in size by yourself.

## Acknowledgements

- [microsoft/playwright](https://github.com/microsoft/playwright)
- [Hopding/pdf-lib](https://github.com/Hopding/pdf-lib)
- [lillallol/outline-pdf](https://github.com/lillallol/outline-pdf)
## License

<a href="./LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
