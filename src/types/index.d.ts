export * from "./playwright"
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

type OutlineInfo = {
  title: string
  folders?: {
    name: string
    collapse?: boolean
  }[]
} & XOR<
  {
    isFolder: boolean
    collapse?: boolean
  },
  {}
>

export type PageFilter = (
  parms: {
    index: number
    length: number
    url: string
  } & OutlineInfo
) => boolean

export type WebPage = {
  url: string
} & OutlineInfo

export type WebPageWithIndex = {
  index: number
} & WebPage

export type PDF = {
  index: number
  buffer: ArrayBuffer
} & OutlineInfo

export type Outline = {
  num: number
} & OutlineInfo
