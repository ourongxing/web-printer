import { outlinePdfFactory } from "@lillallol/outline-pdf"
import * as pdfLib from "pdf-lib"
import { execSync } from "child_process"
import { projectRoot } from "~/utils"
import type { Outline, PDF } from "~/types"
import fs from "fs-extra"

export async function mergePDF(pdfs: PDF[], coverPath?: string) {
  let cover: Uint8Array | undefined = undefined
  if (coverPath) {
    try {
      cover = await fs.readFile(coverPath)
    } catch (e) {
      console.log(e)
    }
  }
  const mergedPdf = cover
    ? await pdfLib.PDFDocument.load(cover)
    : await pdfLib.PDFDocument.create()
  const outlineItems: Outline[] = []
  for (let pdf of pdfs) {
    outlineItems.push({
      ...pdf,
      num: mergedPdf.getPageCount() + 1
    })
    const doc = await pdfLib.PDFDocument.load(pdf.buffer)
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices())
    copiedPages.forEach(page => mergedPdf.addPage(page))
  }

  // 7||Title
  const outline = outlineItems
    .reduce(
      (acc, k) => {
        if (k.folders?.length) {
          k.folders.forEach(({ name, collapse }, index) => {
            if (acc.forders[index] !== name) {
              acc.items.push(
                `${collapse ? "-" : ""}${k.num}|${"----------".slice(
                  0,
                  index
                )}|${name}`
              )
            }
          })
        }
        acc.forders = k.folders?.map(k => k.name) ?? []
        acc.items.push(
          `${k.num}|${"----------".slice(0, k.folders?.length ?? 0)}|${k.title}`
        )
        return acc
      },
      { items: [] as string[], forders: [] as string[] }
    )
    .items.join("\n")
  const outlinedPDF = await outlinePdfFactory(pdfLib)({
    outline,
    pdf: mergedPdf
  })

  return await outlinedPDF.save()
}

/** need ghostscript */
export async function shrinkPDF(path: string, quality: number) {
  execSync(
    `bash ${await projectRoot(
      "scripts/shrinkpdf.sh"
    )} -r ${quality} -o "${path}.tmp" "${path}" >/dev/null 2>&1`
  )
  execSync(`mv "${path}.tmp" "${path}"`)
}
