import { stdout } from "single-line-log"
import type { MaybePromise } from "../typings"

export * from "./bar"

export function delay(t: number) {
  return new Promise(resolve => setTimeout(resolve, t))
}

export async function delayBreak(
  times: number,
  interval: number,
  f: () => MaybePromise<boolean>
) {
  for (let i = 0; i < times; i++) {
    if (await f()) return true
    await delay(interval)
  }
  return false
}

export function slog(s: string) {
  stdout(s)
}
