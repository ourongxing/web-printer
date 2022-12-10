import { describe, expect, test } from "vitest"
import { generateOutline } from "../packages/core/src/pdf"

describe.skip("generate outline", async () => {
  test("outline", async () => {
    const outline = await generateOutline([
      {
        title: "title 1",
        num: 1,
        groups: [
          {
            name: "group 2"
          },
          "group 3"
        ]
      },
      {
        title: "title 2",
        num: 4,
        groups: [
          {
            name: "group 1"
          },
          {
            name: "group 2"
          }
        ]
      }
    ])
    console.log(outline)
  })
})
