import { Sidebar } from "./typing"

// https://github.com/vuejs-translations/docs-zh-cn/blob/main/.vitepress/config.ts
export const vueOutline: Sidebar = {
  文档: [
    {
      text: "开始",
      items: [
        { text: "简介", link: "/guide/introduction" },
        {
          text: "快速上手",
          link: "/guide/quick-start"
        }
      ]
    },
    {
      text: "基础",
      items: [
        {
          text: "创建一个应用",
          link: "/guide/essentials/application"
        },
        {
          text: "模板语法",
          link: "/guide/essentials/template-syntax"
        },
        {
          text: "响应式基础",
          link: "/guide/essentials/reactivity-fundamentals"
        },
        {
          text: "计算属性",
          link: "/guide/essentials/computed"
        },
        {
          text: "类与样式绑定",
          link: "/guide/essentials/class-and-style"
        },
        {
          text: "条件渲染",
          link: "/guide/essentials/conditional"
        },
        { text: "列表渲染", link: "/guide/essentials/list" },
        {
          text: "事件处理",
          link: "/guide/essentials/event-handling"
        },
        { text: "表单输入绑定", link: "/guide/essentials/forms" },
        {
          text: "生命周期",
          link: "/guide/essentials/lifecycle"
        },
        { text: "侦听器", link: "/guide/essentials/watchers" },
        { text: "模板引用", link: "/guide/essentials/template-refs" },
        {
          text: "组件基础",
          link: "/guide/essentials/component-basics"
        }
      ]
    },
    {
      text: "深入组件",
      items: [
        {
          text: "注册",
          link: "/guide/components/registration"
        },
        { text: "Props", link: "/guide/components/props" },
        { text: "事件", link: "/guide/components/events" },
        {
          text: "透传 Attributes",
          link: "/guide/components/attrs"
        },
        { text: "插槽", link: "/guide/components/slots" },
        {
          text: "依赖注入",
          link: "/guide/components/provide-inject"
        },
        {
          text: "异步组件",
          link: "/guide/components/async"
        }
      ]
    },
    {
      text: "逻辑复用",
      items: [
        {
          text: "组合式函数",
          link: "/guide/reusability/composables"
        },
        {
          text: "自定义指令",
          link: "/guide/reusability/custom-directives"
        },
        { text: "插件", link: "/guide/reusability/plugins" }
      ]
    },
    {
      text: "内置组件",
      items: [
        { text: "Transition", link: "/guide/built-ins/transition" },
        {
          text: "TransitionGroup",
          link: "/guide/built-ins/transition-group"
        },
        { text: "KeepAlive", link: "/guide/built-ins/keep-alive" },
        { text: "Teleport", link: "/guide/built-ins/teleport" },
        { text: "Suspense", link: "/guide/built-ins/suspense" }
      ]
    },
    {
      text: "应用规模化",
      items: [
        { text: "单文件组件", link: "/guide/scaling-up/sfc" },
        { text: "工具链", link: "/guide/scaling-up/tooling" },
        { text: "路由", link: "/guide/scaling-up/routing" },
        {
          text: "状态管理",
          link: "/guide/scaling-up/state-management"
        },
        { text: "测试", link: "/guide/scaling-up/testing" },
        {
          text: "服务端渲染 (SSR)",
          link: "/guide/scaling-up/ssr"
        }
      ]
    },
    {
      text: "最佳实践",
      items: [
        {
          text: "生产部署",
          link: "/guide/best-practices/production-deployment"
        },
        {
          text: "性能优化",
          link: "/guide/best-practices/performance"
        },
        {
          text: "无障碍访问",
          link: "/guide/best-practices/accessibility"
        },
        {
          text: "安全",
          link: "/guide/best-practices/security"
        }
      ]
    },
    {
      text: "TypeScript",
      items: [
        { text: "总览", link: "/guide/typescript/overview" },
        {
          text: "TS 与组合式 API",
          link: "/guide/typescript/composition-api"
        },
        {
          text: "TS 与选项式 API",
          link: "/guide/typescript/options-api"
        }
      ]
    },
    {
      text: "进阶主题",
      items: [
        {
          text: "使用 Vue 的多种方式",
          link: "/guide/extras/ways-of-using-vue"
        },
        {
          text: "组合式 API 常见问答",
          link: "/guide/extras/composition-api-faq"
        },
        {
          text: "深入响应式系统",
          link: "/guide/extras/reactivity-in-depth"
        },
        {
          text: "渲染机制",
          link: "/guide/extras/rendering-mechanism"
        },
        {
          text: "渲染函数 & JSX",
          link: "/guide/extras/render-function"
        },
        {
          text: "Vue 与 Web Components",
          link: "/guide/extras/web-components"
        },
        {
          text: "动画技巧",
          link: "/guide/extras/animation"
        },
        {
          text: "响应性语法糖",
          link: "/guide/extras/reactivity-transform"
        }
        // {
        //   text: '为 Vue 构建一个库',
        //   link: '/guide/extras/building-a-library'
        // },
        // { text: 'Custom Renderers', link: '/guide/extras/custom-renderer' },
        // {
        //   text: 'Vue for React 开发者',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  API: [
    {
      text: "全局 API",
      items: [
        { text: "应用实例", link: "/api/application" },
        {
          text: "通用",
          link: "/api/general"
        }
      ]
    },
    {
      text: "组合式 API",
      items: [
        { text: "setup()", link: "/api/composition-api-setup" },
        {
          text: "响应式: 核心",
          link: "/api/reactivity-core"
        },
        {
          text: "响应式: 工具",
          link: "/api/reactivity-utilities"
        },
        {
          text: "响应式: 进阶",
          link: "/api/reactivity-advanced"
        },
        {
          text: "生命周期钩子",
          link: "/api/composition-api-lifecycle"
        },
        {
          text: "依赖注入",
          link: "/api/composition-api-dependency-injection"
        }
      ]
    },
    {
      text: "选项式 API",
      items: [
        { text: "状态选项", link: "/api/options-state" },
        { text: "渲染选项", link: "/api/options-rendering" },
        {
          text: "生命周期选项",
          link: "/api/options-lifecycle"
        },
        {
          text: "组合选项",
          link: "/api/options-composition"
        },
        { text: "其他杂项", link: "/api/options-misc" },
        {
          text: "组件实例",
          link: "/api/component-instance"
        }
      ]
    },
    {
      text: "内置内容",
      items: [
        { text: "指令", link: "/api/built-in-directives" },
        { text: "组件", link: "/api/built-in-components" },
        {
          text: "特殊元素",
          link: "/api/built-in-special-elements"
        },
        {
          text: "特殊 Attributes",
          link: "/api/built-in-special-attributes"
        }
      ]
    },
    {
      text: "单文件组件",
      items: [
        { text: "语法定义", link: "/api/sfc-spec" },
        { text: "<script setup>", link: "/api/sfc-script-setup" },
        { text: "CSS 功能", link: "/api/sfc-css-features" }
      ]
    },
    {
      text: "进阶 API",
      items: [
        { text: "渲染函数", link: "/api/render-function" },
        { text: "服务端渲染", link: "/api/ssr" },
        { text: "TypeScript 工具类型", link: "/api/utility-types" },
        { text: "自定义渲染", link: "/api/custom-renderer" }
      ]
    }
  ]
}

export const ohmymnOutline: Sidebar = [
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

// https://github.com/vitest-dev/docs-cn/blob/dev/.vitepress/config.ts
export const vitestOutline: Sidebar = [
  {
    text: "指南",
    items: [
      {
        text: "简介",
        link: "/guide/why"
      },
      {
        text: "快速起步",
        link: "/guide/"
      },
      {
        text: "主要功能",
        link: "/guide/features"
      },
      {
        text: "命令行界面",
        link: "/guide/cli"
      },
      {
        text: "测试筛选",
        link: "/guide/filtering"
      },
      {
        text: "测试覆盖率",
        link: "/guide/coverage"
      },
      {
        text: "测试快照",
        link: "/guide/snapshot"
      },
      {
        text: "模拟对象",
        link: "/guide/mocking"
      },
      {
        text: "类型测试",
        link: "/guide/testing-types"
      },
      {
        text: "Vitest UI",
        link: "/guide/ui"
      },
      {
        text: "源码内联测试",
        link: "/guide/in-source"
      },
      {
        text: "测试上下文",
        link: "/guide/test-context"
      },
      {
        text: "测试环境",
        link: "/guide/environment"
      },
      {
        text: "扩展匹配器",
        link: "/guide/extending-matchers"
      },
      {
        text: "IDE 插件",
        link: "/guide/ide"
      },
      {
        text: "调试",
        link: "/guide/debugging"
      },
      {
        text: "与其他测试框架对比",
        link: "/guide/comparisons"
      },
      {
        text: "迁移指南",
        link: "/guide/migration"
      }
    ]
  },
  {
    text: "API",
    items: [
      {
        text: "API 索引",
        link: "/api/"
      }
    ]
  },
  {
    text: "配置",
    items: [
      {
        text: "配置索引",
        link: "/config/"
      }
    ]
  }
]
