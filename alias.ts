import { resolve } from "path"
const r = (p: string) => resolve(__dirname, p)
export const alias: Record<string, string> = {
  "@web-printer/core": r("./packages/core/src"),
  "@web-printer/juejin": r("./packages/juejin/src")
}
