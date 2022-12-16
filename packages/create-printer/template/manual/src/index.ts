import { Printer, type Plugin } from "@web-printer/core"

new Printer().use({} as Plugin).print("New PDF", {
  printBackground: true
})
