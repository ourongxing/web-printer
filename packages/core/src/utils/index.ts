import path from "path"
import { stdout } from "single-line-log"

export * from "./bar"

export function delay(t: number) {
  return new Promise(resolve => setTimeout(resolve, t))
}

export function slog(s: string) {
  stdout(s)
}
