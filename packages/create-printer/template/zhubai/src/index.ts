import { Printer } from "@web-printer/core"
import zhubai from "@web-printer/zhubai"

// maybe you need login before printing
// new Printer().login("https://zhubai.love/")

new Printer({
  threads: 5
})
  .use(
    zhubai({
      url: "https://hsxg.zhubai.love/"
    })
  )
  .print("海上星光", {
    filter: ({ index }) => index < 10
  })
