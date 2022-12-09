import { delay, Plugin } from "@web-printer/core"

export default function (options: { url: string }): Plugin {
  const { url } = options
  return {
    async fetchPagesInfo({ context }) {
      const data: any[] = []
      const page = await context.newPage()
      await page.goto(url)
      page.on("response", res => {
        if (res.url().includes("limit=")) {
          res.json().then(d => {
            data.push(...d.data)
          })
        }
      })
      for (let i = 0; i < 5; i++) {
        await delay(500)
        await page.evaluate("window.scrollBy(0, 5000)")
      }
      await page.close()
      return data
        .sort(
          (m, n) =>
            new Date(m.created_at).getTime() - new Date(n.created_at).getTime()
        )
        .map(k => ({
          url: `${url}/posts/${k.id}`,
          title: k.title
        }))
    },
    async beforePrint({ page }) {
      for (let i = 0; i < 10; i++) {
        await delay(300)
        await page.evaluate("window.scrollBy(0, 3000)")
      }
    },
    injectStyle() {
      const style = `
div[class*="PostPage_navRoot"],
button[class*="Button_button"],
div[class*="PostPage_footer"]{
    display: none !important;
}

h1[class*=PostPage_title]{
    margin-top: 0 !important;
}

div[class*=PostPage_post]{
    margin: 0;
    padding: 0;
}
`
      return {
        style,
        titleSelector: `h1[class*=PostPage_title]`
      }
    }
  }
}
