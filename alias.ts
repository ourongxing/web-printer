import { resolve } from "path"
import { compilerOptions } from "./tsconfig.json"
const { paths } = compilerOptions
const r = (p: string) => resolve(__dirname, p)

export const alias = Object.entries(paths).reduce((acc, [key, value]) => {
  acc[key] = r(value[0])
  return acc
}, {} as Record<string, string>)
