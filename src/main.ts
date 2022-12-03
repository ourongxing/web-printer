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
    "https://xiaobot.net/post/614f09ab-31a9-4caa-b55c-2d7683af1c85"
  )
  await page.addStyleTag({ path: await projectRoot("src/xiaobot/style.css") })
}

async function main() {
  const context = await launchPersistentContext()
  // await zhubai("海上星光", "https://hsxg.zhubai.love", title => true, context, {
  //   margin: { top: 0, left: 0, right: 0, bottom: 0 }
  // })
  // await xiaobot(
  //   "产品沉思录 2022",
  //   "https://xiaobot.net/p/pmthinking2022",
  //   title => title.includes("Vol"),
  //   context,
  //   {
  //     margin: { top: 0, left: 70, right: 70, bottom: 0 },
  //     quality: 144
  //   }
  // )
  await ruanyfWeekly(
    "科技爱好者周刊 最新",
    (title, index, length) => length - index <= 4,
    context,
    {
      margin: { top: 0, left: 50, right: 50, bottom: 0 },
      quality: 144
    }
  )
  await context.close()
}

main()
// login()
