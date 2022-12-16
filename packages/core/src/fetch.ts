import type { Page } from "playwright"
import type { MaybePromise } from "./typings"
import { delay } from "./utils"

export async function scrollLoading(
  page: Page,
  itmeNumber: () => MaybePromise<number>,
  options: { interval: number; maxPages: number }
) {
  const { interval = 500, maxPages = Infinity } = options
  let length = 0
  let reTry = 0
  while (1) {
    await page.evaluate(`window.scrollBy(0, document.body.offsetHeight)`)
    await delay(interval)
    const l = await itmeNumber()
    if (Number.isNaN(l)) return []
    if (l >= maxPages) break
    if (l === length) {
      if (reTry === 3) break
      else reTry++
    }
    length = l
  }
}
