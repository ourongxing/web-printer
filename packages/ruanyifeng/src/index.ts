import { delay, PageInfo, Plugin } from "@web-printer/core"

export default function (options: {
  url: string
  removeWeeklyAds?: boolean
  keepComments?: boolean
  groupByYear?: boolean
}): Plugin {
  const { url } = options
  const removeWeeklyAds = url.includes("blog/weekly")
    ? options.removeWeeklyAds ?? false
    : false
  const keepComments = options.keepComments ?? false
  const groupByYear = options.groupByYear ?? true
  return {
    async fetchPagesInfo({ context }) {
      if (!/(?:https:\/\/)?www.ruanyifeng.com\/blog\/\w+\/?/.test(url))
        throw new Error(
          "url is not valid, should be like https://www.ruanyifeng.com/blog/weekly or www.ruanyifeng.com/blog/weekly"
        )
      const page = await context.newPage()
      await page.goto(url)
      const data = JSON.parse(
        await page.evaluate(`
(() => {
const ret = [...document.querySelectorAll("#alpha .module-content h3,#alpha .module-content .module-list-item>a")].reduce((acc,cur)=>{
    if(cur.nodeName === "H3") acc.group = cur.innerText
    else if(acc.group) {
        acc.items.unshift({
            title: cur.innerText,
            url: cur.href,
            groups: [acc.group]
        })
    }
    return acc
}, {items:[], group:""}).items
  return JSON.stringify(ret)
})()
  `)
      ) as PageInfo[]
      await page.close()
      if (groupByYear) return data
      else return data.map(k => ({ ...k, groups: undefined }))
    },
    async beforePrint({ page }) {
      await delay(500)
      await page.evaluate(` document.querySelector(".wwads-hide")?.click() `)
      if (removeWeeklyAds) {
        await page.evaluate(
          `
        ([...document.querySelectorAll("h2,p,blockquote")].reduce((acc,k)=> {
          if(k.nodeName === "H2") acc.unshift([k])
          else if(acc[0]) acc[0].push(k)
        return acc
        }, [])).forEach(k => {
         if(!["科技动态", "文章", "本周", "工具", "图片", "文摘", "留言", "教程", "新闻", "新奇"].find(h=>k[0].innerText.includes(h)) && k.find(m => ["试用", "课程", "礼品", "抽奖", "不要错过", "鸣谢", "非常感谢", "提供支持" ,"名额", "赞助", "原价", "免费", "注册", "课程", "实战"].find(n=>m.innerText.includes(n))))
          k.forEach(m => m.remove())
        });
        `
        )
      }
      await delay(300)
    },
    injectStyle() {
      const style = `
 #header,
 .asset-header,
 #related_entries,
 #comments-open,
 #footer {
     display: none !important;
 }

 ${keepComments ? "#comments { display: block !important; }" : ""}

 img {
     border: 0px !important;
     width: 80%;
     border-radius: 8px !important;
     text-align: center !important;
     margin: 0 auto !important;
 }
 p {
     line-height: 1.5 !important;
 }

 body,
 #container {
     background-color: white !important;
 }

#container,
#content {
    padding: 0!important;
    margin: 0!important;
}

#page-title {
    margin-top: -20px !important;
}
`
      return {
        style,
        titleSelector: "#page-title"
      }
    }
  }
}
