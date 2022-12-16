import { Printer } from "@web-printer/core"
import mdbook from "@web-printer/mdbook"

new Printer({
  threads: 5
})
  .use(
    mdbook({
      url: "https://course.rs/about-book.html"
    })
  )
  .print("Rust Course")
