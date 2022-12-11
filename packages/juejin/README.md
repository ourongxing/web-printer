# @web-printer/juejin

[juejin.cn](https://juejin.cn/)

## Installation
```bash
pnpm i @web-printer/juejin
```

```ts
import { Printer } from "@web-printer/core"
import juejin from "@web-printer/juejin"

new Printer()
  .use(
    juejin({
      url: "https://juejin.cn/?sort=weekly_hottest"
    })
  )
  .print("掘金一周热门")
```

## Options

```ts
{
  /**
   * url of a article list page that you want to print all
   * @example
   * - "https://juejin.cn/frontend"
   * - "https://juejin.cn/tag/JavaScript"
   * - "https://juejin.cn/column/6960944886115729422"
   */
  url: string
  /**
   * scroll to the bottom of the page to load more articles
   */
  scroll?: {
    /**
     * @default 3
     */
    times?: number
    /**
     * @default 500
     */
    interval?: number
  }
}
```

## License

<a href="../../LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
