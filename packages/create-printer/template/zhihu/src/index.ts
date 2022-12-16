import { Printer } from "@web-printer/core"
import zhihu from "@web-printer/zhihu"

// need login before printing
new Printer().login("https://www.zhihu.com")

// new Printer()
//   .use(
//     zhihu({
//       url: "https://www.zhihu.com/collection/19561986"
//     })
//   )
//   .print("值得回头看几遍")
