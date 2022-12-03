import path from "path"
import rootPath from "@grimen/rootpath"

export * from "./pdf"

export function delay(t: number) {
  return new Promise(resolve => setTimeout(resolve, t))
}

export async function projectRoot(p: string) {
  const root = await rootPath.detect()
  return path.resolve(root, p)
}
