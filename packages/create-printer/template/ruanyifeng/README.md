# @web-printer/ruanyifeng

[阮一峰的网络日志 www.ruanyifeng.com/blog](https://www.ruanyifeng.com/blog/archives.html)

## Installation
```bash
pnpm i @web-printer/ruanyifeng
```

```ts
import { Printer } from "@web-printer/core"
import ruanyifeng from "@web-printer/ruanyifeng"

new Printer()
  .use(
    ruanyifeng({
      url: "https://www.ruanyifeng.com/blog/weekly/"
    })
  )
  .print("科技爱好者周刊")
```

## Options

```ts
{
  /**
   * Url of category
   * @example
   * - "https://www.ruanyifeng.com/blog/weekly/"
   * - "https://www.ruanyifeng.com/blog/developer/"
   */
  url: string
  /**
   * Remove weekly ads
   * @when url is https://www.ruanyifeng.com/blog/weekly/
   * @default false
   */
  removeWeeklyAds?: boolean
  /**
   * Outlines group by year
   * @default true
   */
  groupByYear?: boolean
}
```

## License

<a href="https://github.com/ourongxing/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
