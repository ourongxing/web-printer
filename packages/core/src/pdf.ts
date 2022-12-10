import { outlinePdfFactory } from "@lillallol/outline-pdf"
import * as pdfLib from "pdf-lib"
import { PDFDocument } from "pdf-lib"
import type { OutlineItem, PDFBuffer } from "./typings"
import fs from "fs-extra"

export async function mergePDF(pdfList: PDFBuffer[], coverPath?: string) {
  let cover: Uint8Array | undefined = undefined
  if (coverPath) {
    try {
      cover = await fs.readFile(coverPath)
    } catch (e) {
      console.log(e)
    }
  }
  const mergedPdf = cover
    ? await PDFDocument.load(cover)
    : await PDFDocument.create()
  const outlineItems: OutlineItem[] = []
  for (const pdf of pdfList) {
    outlineItems.push({
      ...pdf,
      num: mergedPdf.getPageCount() + 1
    })
    const doc = await pdfLib.PDFDocument.load(pdf.buffer)
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices())
    copiedPages.forEach(page => mergedPdf.addPage(page))
  }

  const outlinedPDF = await outlinePdfFactory(pdfLib)({
    outline: await generateOutline(outlineItems),
    pdf: mergedPdf
  })

  return await outlinedPDF.save()
}

export async function generateOutline(outlineItems: OutlineItem[]) {
  return outlineItems
    .reduce(
      (acc, k) => {
        if (k.groups?.length) {
          k.groups.forEach((group, index) => {
            const name = typeof group === "string" ? group : group.name
            const collapsed =
              typeof group === "string" ? false : group.collapsed
            if (acc.groups[index] !== name) {
              acc.items.push(
                `${collapsed ? "-" : ""}${k.num}|${"----------".slice(
                  0,
                  index
                )}|${name}`
              )
            }
          })
        }
        acc.groups =
          k.groups?.map(k => (typeof k === "string" ? k : k.name)) ?? []
        if (k.selfGroup) {
          acc.groups.push(k.title)
          acc.items.push(
            `${k.collapsed ? "-" : ""}${k.num}|${"----------".slice(
              0,
              k.groups?.length ?? 0
            )}|${k.title}`
          )
        } else {
          acc.items.push(
            `${k.num}|${"----------".slice(0, k.groups?.length ?? 0)}|${
              k.title
            }`
          )
        }
        return acc
      },
      { items: [] as string[], groups: [] as string[] }
    )
    .items.join("\n")
}

/** need ghostscript */
// export async function shrinkPDF(path: string, quality: number) {
//   execSync(
//     `bash ${await projectRoot(
//       "scripts/shrinkpdf.sh"
//     )} -r ${quality} -o "${path}.tmp" "${path}" >/dev/null 2>&1`
//   )
//   execSync(`mv "${path}.tmp" "${path}"`)
// }
