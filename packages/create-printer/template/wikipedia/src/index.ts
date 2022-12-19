import { Printer } from "@web-printer/core"
import wikipedia from "@web-printer/wikipedia"

new Printer()
  .use(
    wikipedia({
      urls: [
        "https://zh.m.wikipedia.org/zh-cn/2022%E5%B9%B4%E5%9C%8B%E9%9A%9B%E8%B6%B3%E5%8D%94%E4%B8%96%E7%95%8C%E7%9B%83",
        "https://zh.m.wikipedia.org/wiki/%E8%8B%B1%E6%A0%BC%E8%98%AD%E8%B6%B3%E7%90%83%E4%BB%A3%E8%A1%A8%E9%9A%8A"
      ]
    })
  )
  .print("2022 世界杯", {
    printBackground: true,
    replaceLink: true
  })
