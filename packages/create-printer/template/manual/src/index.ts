import { Printer, type Plugin } from "@web-printer/core"

new Printer({
  channel: "chrome"
})
  .use({} as Plugin)
  .print("New PDF", {
    printBackground: true
  })
