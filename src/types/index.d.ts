export * from "./print"

interface OutlineInfo {
  title: string
  folders?: {
    name: string
    collapse?: boolean
  }[]
}

export type PageFilter = (
  parms: {
    index: number
    length: number
    url: string
  } & OutlineInfo
) => boolean

export interface WebPage extends OutlineInfo {
  url: string
}

export interface WebPageWithIndex extends WebPage {
  index: number
}

export interface PDF extends OutlineInfo {
  index: number
  buffer: ArrayBuffer
}

export interface Outline extends OutlineInfo {
  num: number
}
