import { Printer } from "@web-printer/core"
import ruanyifeng from "@web-printer/ruanyifeng"

new Printer({
  threads: 5,
  channel: "chrome"
})
  .use(
    ruanyifeng({
      url: "https://www.ruanyifeng.com/blog/weekly/"
    })
  )
  .print("科技爱好者周刊", {
    printBackground: true
  })
