import { Printer } from "@web-printer/core"
import zhihu from "@web-printer/zhihu"

// need login before printing
new Printer({
  channel: "chrome"
}).login("https://www.zhihu.com")

// new Printer({
//   threads: 5,
//   channel: "chrome"
// })
//   .use(
//     zhihu({
//       url: "https://www.zhihu.com/collection/19561986"
//     })
//   )
//   .print("值得回头看几遍")
