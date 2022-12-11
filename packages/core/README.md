# @web-printer/core

The core of [Web Printer](https://github.com/busiyiworld/web-printer), you can use it to create your own printer with plugins.

## Usage

```ts
import { Printer, type Plugin } from "@web-printer/core"

new Printer()
  .use({
    fetchPagesInfo() {
      return []
    },
    injectStyle() {
      return {}
    },
    beforePrint() {}
  } as Plugin)
  .print("a new pdf")
```

## License

<a href="../../LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
