import type { BrowserContext, Page } from "playwright"
export * from "./playwright"

type BaseInfo = {
  title: string
  groups?: (
    | {
        name: string
        collapsed?: boolean
      }
    | string
  )[]
  /**
   * when the item is a group and is a link
   */
  selfGroup?: boolean
  collapsed?: boolean
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
  }): MaybePromise<PageInfoWithoutIndex[]>
  injectStyle?({ url }: { url: string }): MaybePromise<{
    style?: string
    /**
     * if given, printer will only print the content node
     */
    contentSelector?: string
    /**
     * when option.continuous is true, will set margin top for this title.
     * @default "body" but sometimes setting margin top for the body may cause problems.
     */
    titleSelector?: string
  }>
  onPageLoaded?({
    page,
    pageInfo
  }: {
    page: Page
    pageInfo: PageInfo
  }): MaybePromise<void>
  onPageWillPrint?({
    page,
    pageInfo
  }: {
    page: Page
    pageInfo: PageInfo
  }): MaybePromise<void>
}

export type MaybeMultiURL =
  | {
      [k: string]: string
    }
  | string
