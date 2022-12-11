# @web-printer/javascript-info

[javascript.info](https://javascript.info/)

## Installation
```bash
pnpm i @web-printer/javascript-info
```

```ts
import { Printer } from "@web-printer/core"
import javascriptInfo from "@web-printer/javascript-info"

new Printer()
  .use(
    javascriptInfo({
      url: "https://javascript.info/"
    })
  )
  .print("The Modern JavaScript Tutorial")
```

## Options

```ts
{
  /**
   * url of javascript.info outline, support all languages
   * @example
   * - "https://javascript.info/"
   * - "https://zh.javascript.info/"
   * - "https://ja.javascript.info/"
   */
  url: string
}
```

## License

<a href="../../LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
