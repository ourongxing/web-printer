import fs from "fs-extra"
import type { BrowserContext } from "playwright"
import { print } from "~/core"
import type { PrintOption, Filter } from "~/types"
import { delay, projectRoot } from "~/utils"

interface WeeklyPage {
  title: string
  num: number
  year: number
  month: number
}

async function fetchPagesInfo(filter: Filter) {
  const content = (
    await fs.readFile(await projectRoot("src/ruanyfWeekly/outline.md"), "utf-8")
  ).toString()
  const data = content.split("\n").reduce(
    (acc, cur) => {
      cur = cur.trim()
      if (cur) {
        const year = cur.replace(/^## (\w{4})$/, "$1")
        if (cur !== year) {
          acc.year = Number(year)
        } else {
          const month = cur.replace(/^\**(.+)月\**$/, "$1")
          if (cur !== month) {
            acc.month =
              [
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九",
                "十",
                "十一",
                "十二"
              ].indexOf(month) + 1
          } else if (acc.month && acc.year) {
            const temp = cur.replace(
              /^.+第\s*(\d+?)\s*期.+\[(.+?)\].*$/,
              "$1||$2"
            )
            if (cur !== temp) {
              const [num, title] = temp.split("||")
              acc.pages.push({
                title,
                num: Number(num),
                year: acc.year,
                month: acc.month
              })
            }
          }
        }
      }
      return acc
    },
    { pages: [] as WeeklyPage[], year: 0, month: 0 }
  )
  return data.pages
    .sort((m, n) => m.num - n.num)
    .map(k => ({
      title: `第 ${k.num} 期：${k.title}`,
      url: `https://www.ruanyifeng.com/blog/${k.year}/${String(
        k.month
      ).padStart(2, "0")}/weekly-issue-${k.num}.html`
    }))
    .filter((k, i) => filter(k.title, i, data.pages.length))
}

export default async function (
  name: string,
  filter: Filter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  const page = await context.newPage()
  const pagesInfo = await fetchPagesInfo(filter)
  console.log(`Printing ${name}...\n`)
  await print(name, pagesInfo, page, {
    async injectFunc() {
      await delay(700)
    },
    stylePath: "src/ruanyfWeekly/style.css",
    printOption
  })
  await page.close()
}
