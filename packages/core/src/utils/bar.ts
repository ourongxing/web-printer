import { slog } from "."

export class ProgressBar {
  length: number
  constructor(length = 25) {
    this.length = length
  }
  render(description: string, opts: { completed: number; total: number }) {
    const percent = Number((opts.completed / opts.total).toFixed(4))
    const cellNum = Math.floor(percent * this.length)

    let cell = ""
    for (let i = 0; i < cellNum; i++) {
      cell += "█"
    }

    let empty = ""
    for (let i = 0; i < this.length - cellNum; i++) {
      empty += "░"
    }

    slog(
      `${cell + empty} ${String(opts.completed).padStart(
        String(opts.total).length,
        " "
      )}/${opts.total}   ${description}`
    )
  }
}
