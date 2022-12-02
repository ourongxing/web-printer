export * from "./pdf"
export * from "./playwright"

export function delay(t: number) {
  return new Promise(resolve => setTimeout(resolve, t))
}
