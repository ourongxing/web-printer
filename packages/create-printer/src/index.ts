#!/usr/bin/env node

import fs from "fs-extra"
import path from "path"
import minimist from "minimist"
import prompts from "prompts"
import { red, reset } from "kolorist"

type ColorFunc = (str: string | number) => string

type PluginOption = {
  name: string
  display: string
  color?: ColorFunc
}
const cwd = process.cwd()
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })

const plugins: PluginOption[] = [
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
    name: "manual",
    display: "Manual"
  }
]

const defaultTargetDir = "web-printer"
async function init() {
  const argTargetDir = argv._[0]
  const argPlugin = argv.plugin || argv.p
  let targetDir = argTargetDir || defaultTargetDir

  let result: prompts.Answers<"projectName" | "overwrite" | "plugin">

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
          message: reset("Select a plugin template:"),
          initial: 0,
          choices: plugins.map(k => {
            return {
              title: k.color
                ? k.color(k.display || k.name)
                : k.display || k.name,
              value: k.name
            }
          })
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
  const { plugin, overwrite } = result
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
  console.log()
  console.log("Done. Now Run:")
  console.log()
  console.log(red(`cd ${targetDir} && pnpm i && pnpm pw && code .`))
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0
}

init().catch(r => {
  console.error(r)
})
