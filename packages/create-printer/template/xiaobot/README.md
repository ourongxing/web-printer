# @web-printer/xiaobot

> **Warning**
>
> some pages may be need to login and pay to read, so you may need to login and pay to read before print.

[小报童 xiaobot.net](https://xiaobot.net)

## Installation
```bash
pnpm i @web-printer/xiaobot
```

```ts
import { Printer } from "@web-printer/core"
import xiaobot from "@web-printer/xiaobot"

new Printer()
  .use(
    xiaobot({
      url: "https://xiaobot.net/p/pmthinking2022"
    })
  )
  .print("产品沉思录 | 2022")
```

## Options

```ts
{
  /**
   * Url of the newsletter home page that you want to print
   * @example
   * - "https://xiaobot.net/p/pmthinking2022"
   */
  url: string
  /**
   * When the article list page has a lot of articles, you can set maxPages to limit, especially endless loading.
   * @default Infinity
   */
  maxPages?: number
  /**
   * Interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
}
```

## License

<a href="https://github.com/busiyiworld/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
