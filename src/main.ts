import { chromium } from "playwright"
import { projectRoot } from "~/utils"
import javascriptInfo from "./javascriptInfo"
import mdbook from "./mdbook"
import ruanyfWeekly from "./ruanyfWeekly"
import { ContextOption } from "./types"
import vitepress from "./vitepress"
import xiaobot from "./xiaobot"
import zhubai from "./zhubai"

async function launchPersistentContext(options: ContextOption) {
  return await chromium.launchPersistentContext(await projectRoot("userData"), {
    ...options
  })
}

async function test() {
  const context = await launchPersistentContext({
    headless: false,
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 4 XL Build/TPB3.220610.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.99 XWEB/3235 MMWEBSDK/20220402 Mobile Safari/537.36 MMWEBID/4289 MicroMessenger/8.0.22.2140(0x280016F8) WeChat/arm64 Weixin NetType/WIFI Language/en ABI/arm64"
  })
}

async function main() {
  const context = await launchPersistentContext({
    headless: true
  })
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
  // await javascriptInfo("现代 JavaScript 教程", () => true, context, {
  //   margin: { top: 0, left: 30, right: 30, bottom: 0 },
  //   quality: 144,
  //   thread: 10,
  //   printBackground: true
  // })
}

// main()
test()
