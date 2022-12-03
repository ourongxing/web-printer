import { launchPersistentContext } from "~/utils"
import ruanyfWeekly from "./ruanyfWeekly"
import xiaobot from "./xiaobot"
import zhubai from "./zhubai"

async function login() {
  const context = await launchPersistentContext()
  const page = await context.newPage()
  await page.goto("https://xiaobot.net/p/pmthinking2022")
}

async function main() {
  const context = await launchPersistentContext()
  await zhubai(
    context,
    "https://hsxg.zhubai.love",
    "海上星光",
    title => title.includes("11") || title.includes("22"),
    {
      margin: { top: 0, left: 0, right: 0, bottom: 0 }
    }
  )
  // await xiaobot(
  //   context,
  //   "https://xiaobot.net/p/pmthinking2022",
  //   "产品沉思录 2022",
  //   title => title.includes("033"),
  //   {
  //     margin: { top: 0, left: 70, right: 70, bottom: 0 }
  //   }
  // )
  // await ruanyfWeekly(context, {
  //   margin: { top: 0, left: 50, right: 50, bottom: 0 }
  // })
  await context.close()
}

main()
// login()
