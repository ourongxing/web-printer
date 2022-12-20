import { Printer } from "@web-printer/core"
import xiaobot from "@web-printer/xiaobot"

// need login before printing
new Printer({
  channel: "chrome"
}).login("https://xiaobot.net/")

// new Printer({
//   threads: 1,
//   channel: "chrome"
// })
//   .use(
//     xiaobot({
//       url: "https://xiaobot.net/p/pmthinking2022"
//     })
//   )
//   .print("产品沉思录 | 2022")
