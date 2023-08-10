# @web-printer/core

The core of [Web Printer](https://github.com/busiyiworld/web-printer), you can use it to create your own printer with plugins to print website you want.

## Usage

```ts
import { Printer, type Plugin } from "@web-printer/core"
import type { Plugin, PrinterOption, PrinterPrintOption } from "@web-printer/core"

new Printer({} as PrinterOption)
  .use({} as Plugin)
  .print("PDF name", {} as PrinterPrintOption)
```

## License

<a href="https://github.com/ourongxing/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
