import type { BrowserContext, Page } from "playwright"
export * from "./playwright"

type BaseInfo = {
  title: string
  groups?: (
    | {
        name: string
        collapse?: boolean
      }
    | string
  )[]
} & XOR<
  {
    selfGroup: boolean
    collapse?: boolean
  },
  {}
>

const a: BaseInfo = {
  title: "a",
  groups: ["a", "b", "c"],
  selfGroup: true,
  collapse: true
}

export type PageInfoWithoutIndex = {
  url: string
} & BaseInfo

export type PageInfo = {
  index: number
  url: string
} & BaseInfo

export type PDFBuffer = {
  buffer: ArrayBuffer
} & PageInfo

export type OutlineItem = {
  num: number
} & BaseInfo

export type PageFilter = (
  parms: {
    length: number
  } & PageInfo
) => boolean

export interface Plugin {
  fetchPagesInfo({
    context
  }: {
    context: BrowserContext
  }): Promise<PageInfoWithoutIndex[]>
  injectStyle?(): {
    style?: string
    titleSelector?: string
  }
  beforePrint?({
    page,
    pageInfo
  }: {
    page: Page
    pageInfo: PageInfo
  }): Promise<void>
}
