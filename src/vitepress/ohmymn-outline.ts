import { Sidebar } from "./typing"

export const outline: Sidebar = [
  {
    text: "基础",
    collapsible: true,
    items: [
      {
        text: "简介",
        link: "/guide/"
      },
      {
        text: "注意事项",
        link: "/guide/attention"
      },
      {
        text: "基本概念",
        link: "/guide/concept"
      },
      {
        text: "配置管理",
        link: "/guide/profile"
      }
    ]
  },
  {
    text: "进阶",
    collapsible: true,
    collapsed: true,
    items: [
      {
        text: "正则表达式",
        link: "/guide/regex"
      },
      {
        text: "Replace() 函数",
        link: "/guide/replace"
      },
      {
        text: "Split() 函数",
        link: "/guide/split"
      },
      {
        text: "模版语法",
        link: "/guide/mustache"
      },
      {
        text: "模版变量",
        link: "/guide/vars"
      },
      {
        text: "自定义输入格式",
        link: "/guide/custom"
      },
      {
        text: "自动编号",
        link: "/guide/serial"
      }
    ]
  },
  {
    text: "必选模块",
    collapsible: true,
    collapsed: false,
    items: [
      {
        text: "OhMyMN",
        link: "/guide/modules/ohmymn"
      },
      {
        text: "MagicAction for Card",
        link: "/guide/modules/magicaction4card"
      },
      {
        text: "MagicAction for Text",
        link: "/guide/modules/magicaction4text"
      }
    ]
  },
  {
    text: "可选模块",
    collapsible: true,
    collapsed: true,
    items: [
      {
        text: "Shortcut",
        link: "/guide/modules/shortcut"
      },
      {
        text: "Gesture",
        link: "/guide/modules/gesture"
      },
      {
        text: "Another AutoTitle",
        link: "/guide/modules/anotherautotitle"
      },
      {
        text: "Another AutoDef",
        link: "/guide/modules/anotherautodef"
      },
      {
        text: "AutoFormat",
        link: "/guide/modules/autoformat"
      },
      {
        text: "AutoComplete",
        link: "/guide/modules/autocomplete"
      },
      {
        text: "AutoReplace",
        link: "/guide/modules/autoreplace"
      },
      {
        text: "AutoList",
        link: "/guide/modules/autolist"
      },
      {
        text: "AutoTag",
        link: "/guide/modules/autotag"
      },
      {
        text: "AutoStyle",
        link: "/guide/modules/autostyle"
      },
      {
        text: "CopySearch",
        link: "/guide/modules/copysearch"
      },
      {
        text: "AutoTranslate",
        link: "/guide/modules/autotranslate"
      },
      {
        text: "AutoOCR",
        link: "/guide/modules/autoocr"
      },
      {
        text: "AutoComment",
        link: "/guide/modules/autocomment"
      },
      {
        text: "AutoSimplify",
        link: "/guide/modules/autosimplify"
      }
    ]
  }
]
