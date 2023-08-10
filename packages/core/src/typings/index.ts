export * from "./options"
export * from "./utils"
export * from "./plugin"

export type SubOutlineItem = {
  title: string
  depth: number
  id: string
  num?: number
  coordinate?: [number, number, number]
}

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
   * When the item is a group and is a link
   */
  selfGroup?: boolean
  collapsed?: boolean
  outline?: SubOutlineItem[]
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
  url: string
} & BaseInfo

export type PageFilter = (
  parms: {
    length: number
  } & PageInfo
) => boolean

export type MaybeMultiURL =
  | {
      [k: string]: string
    }
  | string
