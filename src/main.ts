import { chromium } from "playwright"
import { projectRoot } from "~/utils"
import mdbook from "./mdbook"
import ruanyfWeekly from "./ruanyfWeekly"
import vitepress from "./vitepress"
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
  // await page.goto("https://course.rs/community.html")
}

async function main() {
  const context = await launchPersistentContext(false)
  // await zhubai("海上星光1", "https://hsxg.zhubai.love", () => true, context, {
  //   margin: { top: 0, left: 0, right: 0, bottom: 0 },
  //   thread: 3
  // })
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
  //   }
  // )
  // await vitepress(
  //   "OhMyMN V4.1.1 文档",
  //   "https://ohmymn.marginnote.cn",
  //   () => true,
  //   context,
  //   {
  //     margin: { top: 0, left: 0, right: 0, bottom: 0 },
  //     quality: 144,
  //     thread: 5,
  //     coverPath: "/Users/ourongxing/Downloads/OhMyMN 封面.pdf",
  //     printBackground: true
  //   }
  // )
  // await vitepress(
  //   "Vue v3.2 中文文档",
  //   "https://cn.vuejs.org",
  //   () => true,
  //   context,
  //   {
  //     margin: { top: 0, left: 30, right: 30, bottom: 0 },
  //     quality: 144,
  //     thread: 5,
  //     printBackground: true
  //   }
  // )
  await mdbook(
    "Rust 语言圣经(Rust Course)",
    "https://course.rs",
    ({ index }) => true,
    context,
    {
      margin: { top: 0, left: 30, right: 30, bottom: 0 },
      quality: 144,
      thread: 10,
      printBackground: true
    }
  )
  // await vitepress(
  //   "Vitest v0.25 中文文档",
  //   "https://cn.vitest.dev",
  //   () => true,
  //   context,
  //   {
  //     margin: { top: 0, left: 0, right: 0, bottom: 0 },
  //     quality: 144,
  //     thread: 1,
  //     printBackground: true
  //   }
  // )
}

main()
// login()
