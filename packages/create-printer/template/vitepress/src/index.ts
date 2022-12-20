import { Printer } from "@web-printer/core"
import vitepress from "@web-printer/vitepress"

new Printer({
  threads: 5,
  channel: "chrome"
})
  .use(
    vitepress({
      url: {
        Guide: "https://vuejs.org/guide/introduction.html",
        API: "https://vuejs.org/api/application.html"
      }
    })
  )
  .print("Vue 3.2 Documentation", {
    printBackground: true
  })
