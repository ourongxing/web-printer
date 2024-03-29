# @web-printer/mdbook

These sites are using [rust-lang/mdBook](https://github.com/rust-lang/mdBook)
- [Rust Course](https://course.rs/about-book.html)
- [mdBook Documentation](https://rust-lang.github.io/mdBook/)
- [The Rust Programming Language](https://doc.rust-lang.org/book/)

## Installation
```bash
pnpm i @web-printer/mdbook
```

```ts
import { Printer } from "@web-printer/core"
import mdbook from "@web-printer/mdbook"

new Printer()
  .use(
    mdbook({
      url: "https://course.rs/about-book.html"
    })
  )
  .print("Rust Course")
```

## Options

```ts
{
  /**
   * Url of website page generated by mdbook, this page must have sidebar outline
   * @example
   * - "https://course.rs/about-book.html"
   * - "https://rust-lang.github.io/mdBook/"
   */
  url: string
}
```

## License

<a href="https://github.com/ourongxing/web-printer/blob/main/LICENSE">MIT</a> <span>©</span> <a href="https://github.com/ourongxing"><img width=15 src="https://avatars.githubusercontent.com/u/48356807?v=4"></a>
