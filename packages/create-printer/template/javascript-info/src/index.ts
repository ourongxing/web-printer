import { Printer } from "@web-printer/core"
import javascriptInfo from "@web-printer/javascript-info"

new Printer({
  threads: 5,
  channel: "chrome"
})
  .use(
    javascriptInfo({
      url: "https://javascript.info/"
    })
  )
  .print("The Modern JavaScript Tutorial", {
    printBackground: true
  })
