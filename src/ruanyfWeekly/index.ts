import fs from "fs-extra"
import type { BrowserContext } from "playwright"
import { print } from "~/core"
import type { PrintOption, PageFilter, WebPage } from "~/types"
import { delay, projectRoot } from "~/utils"

interface WeeklyPage {
  title: string
  num: number
  year: number
  month: number
}

async function fetchPagesInfo(pageFilter: PageFilter): Promise<WebPage[]> {
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
      ).padStart(2, "0")}/weekly-issue-${k.num}.html`,
      folders: [{ name: k.year.toString(), collapse: false }]
    }))
    .filter((k, i) =>
      pageFilter({
        ...k,
        index: i,
        length: data.pages.length
      })
    )
}

export default async function (
  name: string,
  pageFilter: PageFilter,
  context: BrowserContext,
  printOption?: PrintOption
) {
  // const page = await context.newPage()
  const pagesInfo = await fetchPagesInfo(pageFilter)
  console.log(`Printing ${name}...\n`)
  await print(name, pagesInfo, context, {
    async injectFunc(page) {
      await delay(500)
      await page.addScriptTag({
        content: `
        ([...document.querySelectorAll("h2,p,blockquote")].reduce((acc,k)=> {
          if(k.nodeName === "H2") acc.unshift([k])
          else if(acc[0]) acc[0].push(k)
        return acc
        }, [])).forEach(k => {
         if(!["科技动态", "文章", "本周", "工具", "图片", "文摘", "留言", "教程", "新闻", "新奇"].find(h=>k[0].innerText.includes(h)) && k.find(m => ["试用", "课程", "礼品", "抽奖", "不要错过", "鸣谢", "非常感谢", "提供支持" ,"名额", "赞助", "原价", "免费", "注册", "课程", "实战"].find(n=>m.innerText.includes(n))))
          k.forEach(m => m.remove())
        });
        document.querySelector(".wwads-hide").click()
        `
      })
      await delay(300)
    },
    stylePath: "src/ruanyfWeekly/style.css",
    printOption
  })
}
