# @web-printer/zhubai

> **Warning**
>
> some pages may be need to login and pay to read, so you may need to login and pay to read before print.


[zhubai.love](https://zhubai.love)

## Installation
```bash
pnpm i @web-printer/zhubai
```

```ts
import { Printer } from "@web-printer/core"
import zhubai from "@web-printer/zhubai"

new Printer()
  .use(
    zhubai({
      url: "https://hsxg.zhubai.love/"
    })
  )
  .print("海上星光")
```

## Options

```ts
{
  /**
   * url of the newsletter home page that you want to print
   * @example https://hsxg.zhubai.love/
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
