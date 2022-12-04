export type Sidebar = SidebarGroup[] | SidebarMulti

export interface SidebarMulti {
  [path: string]: SidebarGroup[]
}

export interface SidebarGroup {
  text?: string
  items: SidebarItem[]

  /**
   * If `true`, toggle button is shown.
   *
   * @default false
   */
  collapsible?: boolean

  /**
   * If `true`, collapsible group is collapsed by default.
   *
   * @default false
   */
  collapsed?: boolean
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] }
