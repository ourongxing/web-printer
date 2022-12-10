import { chromium } from "playwright"
import { describe, expect, test } from "vitest"
import { delay } from "../packages/core/src/utils"

describe(
  "inject style",
  async () => {
    test.skip("inject style", async () => {
      const context = await chromium.launchPersistentContext("userData", {
        colorScheme: "light",
        headless: false
      })
      const page = await context.newPage()
      await page.goto(
        "https://doc.rust-lang.org/stable/book/ch01-01-installation.html#installing-rustup-on-linux-or-macos"
      )
      await delay(1000)
      await page.addStyleTag({
        content: `
        #menu-bar,
#giscus-container,
.nav-wrapper,
.sidetoc {
    display: none !important;
}

main {
    margin: 0 !important;
}

main > * {
    margin-top: 0
}

#page-wrapper > div,
#content {
    padding: 0;
}

code:not(.hljs) {
    background-color: #f6f7f6 !important;
}

        `
      })

      await page.pause()
    })
  },
  { timeout: 1000 * 60 * 5 }
)
