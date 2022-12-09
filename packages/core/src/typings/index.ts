import { BrowserContext, Page } from "playwright"
import { PrintOption } from "./playwright"

export * from "./playwright"
export type MaybePromise<T> = Promise<T> | T
export type MaybeArray<T> = Array<T> | T

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

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
