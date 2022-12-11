# @web-printer/xiaobot

> **Warn**
>
> some pages may be need to login and pay to read, so you may need to login and pay to read before print.

[xiaobot.net](https://xiaobot.net)

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
   * url of the newsletter home page that you want to print
   * @example https://xiaobot.net/p/pmthinking2022
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
