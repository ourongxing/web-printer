# @web-printer/zhihu
> **Warning**
>
> need login before printing

[知乎 zhihu.cn](https://zhihu.cn/)

## Installation
```bash
pnpm i @web-printer/zhihu
```

```ts
import { Printer } from "@web-printer/core"
import zhihu from "@web-printer/zhihu"

new Printer()
  .use(
    zhihu({
      url: "https://www.zhihu.com/collection/19561986"
    })
  )
  .print("值得回头看几遍")
```

## Options

```ts
{
  /**
   * Url of an article list page
   * @example
   * - "https://zhuanlan.zhihu.com/mactalk"
   * - "https://www.zhihu.com/collection/19561986"
   * - "https://www.zhihu.com/topic/20069728/top-answers"
   */
  url: string
  /**
   * When artical list page have much articals, you can set maxPages to limit, especially endless loading.
   */
  maxPages?: number
  /**
   * When artical list page have paginations, you can set threads to speed up fetch articals url.
   * @default 1
   */
  threads?: number
  /**
   * Interval of each scroll
   * @default 500
   * @unit ms
   */
  interval?: number
  /**
   * waiting img and latex lazy load
   * @default 500
   * @unit ms
   */
  imgWaiting?: number
}
```

## License

<a href="https://github.com/ourongxing/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
