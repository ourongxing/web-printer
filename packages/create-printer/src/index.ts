#!/usr/bin/env node

import fs from "fs-extra"
import path from "path"
import minimist from "minimist"
import prompts from "prompts"
import { green, red, reset } from "kolorist"

type ColorFunc = (str: string | number) => string

type Option = {
  name: string
  display: string
  color?: ColorFunc
}
const cwd = process.cwd()
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })

const plugins: Option[] = [
  {
    name: "vitepress",
    display: "Vitepress"
  },
  {
    name: "mdbook",
    display: "mdBook"
  },
  {
    name: "juejin",
    display: "掘金"
  },
  {
    name: "zhihu",
    display: "知乎"
  },
  {
    name: "javascript-info",
    display: "javascript.info"
  },
  {
    name: "xiaobot",
    display: "小报童"
  },
  {
    name: "zhubai",
    display: "竹白"
  },
  {
    name: "ruanyifeng",
    display: "阮一峰的网络日志"
  },
  {
    name: "wikipedia",
    display: "Wikipedia"
  },
  {
    name: "manual",
    display: "Manual"
  }
]

const channels: Option[] = [
  {
    name: "chromium",
    display: "Chromium"
  },
  {
    name: "chrome",
    display: "Chrome"
  },
  {
    name: "chrome-beta",
    display: "Chrome Beta"
  },
  {
    name: "chrome-dev",
    display: "Chrome Dev"
  },
  {
    name: "chrome-canary",
    display: "Chrome Canary"
  },
  {
    name: "msedge",
    display: "Microsoft Edge"
  },
  {
    name: "msedge-beta",
    display: "Microsoft Edge Beta"
  },
  {
    name: "msedge-dev",
    display: "Microsoft Edge Dev"
  },
  {
    name: "msedge-canary",
    display: "Microsoft Edge Canary"
  }
]

const defaultTargetDir = "web-printer"
async function init() {
  const argTargetDir = argv._[0]
  const argPlugin = argv.plugin || argv.p
  const argChannel = argv.channel || argv.c
  let targetDir = argTargetDir || defaultTargetDir
  let targetChannelName = ""
  let result: prompts.Answers<
    "projectName" | "overwrite" | "plugin" | "channel" | "haveInstalled"
  >

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: targetDir,
          onState: state => {
            targetDir = state.value.trim() || defaultTargetDir
          }
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }
            return null
          },
          name: "overwriteChecker"
        },
        {
          type:
            argPlugin && plugins.find(k => k.name === argPlugin)
              ? null
              : "select",
          name: "plugin",
          message: reset("Select a priner template:"),
          initial: 0,
          choices: plugins.map(k => {
            return {
              title: k.color
                ? k.color(k.display || k.name)
                : k.display || k.name,
              value: k.name
            }
          })
        },
        {
          type:
            argChannel && channels.find(k => k.name === argChannel)
              ? null
              : "select",
          name: "channel",
          message: reset(
            "Select a Chromium channel you have installed or want to install:"
          ),
          initial: 0,
          choices: channels.map(k => {
            return {
              title: k.color
                ? k.color(k.display || k.name)
                : reset(k.display || k.name),
              value: k.name
            }
          }),
          onState: state => {
            targetChannelName = channels.find(
              k => k.name === state.value
            )!.display
          }
        },
        {
          type: () => (targetChannelName ? "confirm" : null),
          name: "haveInstalled",
          message: () => reset(`Do you have installed ${targetChannelName} ?`),
          initial: true
        }
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
  const { plugin, overwrite, channel, haveInstalled } = result
  const root = path.join(cwd, targetDir)
  if (overwrite) {
    await fs.remove(targetDir)
  }

  const templateDir = path.resolve(
    __dirname,
    "../template",
    plugin || argPlugin
  )

  await fs.copy(templateDir, root)
  const indexFilePath = path.resolve(root, "src/index.ts")
  await fs.writeFile(
    indexFilePath,
    (await fs.readFile(indexFilePath))
      .toString("utf8")
      .replace(/channel: "chrome"/g, `channel: "${channel || argChannel}"`)
  )
  console.log()
  console.log("Done. Now Run:")
  console.log()
  if (channel && !haveInstalled)
    console.log(green(`> pnpm dlx playwright install ${channel}`))
  console.log(red(`> cd ${targetDir} && pnpm i && code .`))
  console.log()
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0
}

init().catch(r => {
  console.error(r)
})
