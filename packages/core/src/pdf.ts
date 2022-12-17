import { outlinePdfFactory } from "@lillallol/outline-pdf"
import * as pdfLib from "pdf-lib"
import type { PDFRef } from "pdf-lib"
import { PDFDict, PDFDocument, PDFName, StandardFonts } from "pdf-lib"
import type { OutlineItem, PDFBuffer } from "./typings"
import fs from "fs-extra"
import type { PrinterPrintOption } from "./typings"

export async function mergePDF(
  pdfList: PDFBuffer[],
  printOption: PrinterPrintOption
) {
  let cover: Uint8Array | undefined = undefined
  const { coverPath, continuous, addPageNumber } = printOption
  if (coverPath) {
    try {
      cover = await fs.readFile(coverPath)
    } catch (e) {
      console.log(e)
    }
  }
  const mergedPDF = cover
    ? await PDFDocument.load(cover)
    : await PDFDocument.create()
  const outlineItems: OutlineItem[] = []
  for (const pdf of pdfList) {
    outlineItems.push({
      ...pdf,
      groups: [...new Set(pdf.groups)],
      num: mergedPDF.getPageCount() + 1
    })
    const doc = await pdfLib.PDFDocument.load(pdf.buffer)
    const copiedPages = await mergedPDF.copyPages(doc, doc.getPageIndices())
    copiedPages.forEach(page => mergedPDF.addPage(page))
  }

  let rPDF = await new PrinterPDF(mergedPDF).addOutline(outlineItems)
  if (!continuous && addPageNumber)
    rPDF = await rPDF.addPageNumbers(outlineItems[0].num - 1)
  return rPDF.replaceInnerLink(outlineItems).save()
}

export function generateOutline(outlineItems: OutlineItem[]) {
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

class PrinterPDF {
  pdf: PDFDocument
  constructor(pdf: PDFDocument) {
    this.pdf = pdf
  }
  async addOutline(outlineItems: OutlineItem[]) {
    return new PrinterPDF(
      await outlinePdfFactory(pdfLib)({
        outline: generateOutline(outlineItems),
        pdf: this.pdf
      })
    )
  }
  replaceInnerLink(outlineItems: OutlineItem[]) {
    const { pdf } = this
    const pages = pdf.getPages()
    pages.forEach(p => {
      const annotes = p.node.Annots()
      annotes?.asArray().forEach(annote => {
        const dict = pdf.context.lookupMaybe(annote, PDFDict)
        if (!dict) return
        const a = dict.get(PDFName.of(`A`))
        const link = pdf.context.lookupMaybe(a, PDFDict)
        const url = link?.get(PDFName.of("URI"))?.toString().slice(1, -1)
        if (url) {
          const item = outlineItems.find(
            k =>
              url.replace(/\/?[#?].+$/, "") === k.url.replace(/\/?[#?].+$/, "")
          )
          if (item) {
            pdf.context.assign(
              annote as PDFRef,
              pdf.context.obj({
                Type: "Annot",
                Subtype: "Link",
                Rect: dict.lookup(PDFName.of("Rect")),
                Border: dict.lookup(PDFName.of("Border")),
                C: dict.lookup(PDFName.of("C")),
                Dest: [pages[item.num - 1].ref, "XYZ", null, null, null]
              })
            )
          }
        }
      })
    })
    return this
  }
  async addPageNumbers(startIndex: number) {
    const { pdf } = this
    const courierBoldFont = await pdf.embedFont(StandardFonts.Courier)
    const pageIndices = pdf.getPageIndices()
    for (const pageIndex of pageIndices) {
      if (pageIndex >= startIndex) {
        const page = pdf.getPage(pageIndex)
        page.drawText(`${pageIndex + 1}`, {
          x: page.getWidth() / 2,
          y: 20,
          font: courierBoldFont,
          size: 12
        })
      }
    }
    return this
  }
  save() {
    return this.pdf.save()
  }
}
