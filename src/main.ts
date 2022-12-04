import { chromium } from "playwright"
import { projectRoot } from "~/utils"
import ruanyfWeekly from "./ruanyfWeekly"
import xiaobot from "./xiaobot"
import zhubai from "./zhubai"

async function launchPersistentContext(headless = true) {
  return await chromium.launchPersistentContext(await projectRoot("userData"), {
    headless
  })
}

async function login() {
  const context = await launchPersistentContext(false)
  const page = await context.newPage()
  await page.goto(
    "https://www.ruanyifeng.com/blog/2022/11/weekly-issue-232.html"
  )
  await page.addStyleTag({
    path: await projectRoot("src/ruanyfWeekly/style.css")
  })
}

async function main() {
  const context = await launchPersistentContext()
  await zhubai("海上星光1", "https://hsxg.zhubai.love", () => true, context, {
    margin: { top: 0, left: 0, right: 0, bottom: 0 },
    thread: 3
  })
  // await xiaobot(
  //   "产品沉思录(2022)",
  //   "https://xiaobot.net/p/pmthinking2022",
  //   ({ title }) => title.includes("Vol"),
  //   context,
  //   {
  //     margin: { top: 0, left: 70, right: 70, bottom: 0 },
  //     quality: 144
  //   }
  // )
  // await ruanyfWeekly(
  //   // "科技爱好者周刊(2018-2021)",
  //   "科技爱好者周刊(2022)",
  //   ({ folders }) => !!folders?.find(k => k.name === "2022"),
  //   context,
  //   {
  //     margin: { top: 0, left: 50, right: 50, bottom: 0 },
  //     quality: 144,
  //     printBackground: true,
  //     collapse: true
  //   }
  // )
}

main()
// login()
