import { Printer } from "@web-printer/core"
import juejin from "@web-printer/juejin"

new Printer({
  threads: 5
})
  .use(
    juejin({
      url: "https://juejin.cn/?sort=weekly_hottest",
      maxPages: 20
    })
  )
  .print("掘金一周热门", {
    printBackground: true
  })
