import { stdout as slog } from "single-line-log"

export class ProgressBar {
  length: number
  constructor(length = 25) {
    this.length = length
  }
  render(description: string, opts: { completed: number; total: number }) {
    const percent = Number((opts.completed / opts.total).toFixed(4))
    const cell_num = Math.floor(percent * this.length)

    let cell = ""
    for (var i = 0; i < cell_num; i++) {
      cell += "█"
    }

    let empty = ""
    for (var i = 0; i < this.length - cell_num; i++) {
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
