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
  const { coverPath, continuous, addPageNumber, replaceLink } = printOption
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
  if (replaceLink) rPDF = rPDF.replaceInnerLink(outlineItems)
  return rPDF.save()
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
    pdf.setCreator("")
    pdf.setCreator(
      "Respect the copyright please! Do not share non-public content on the network, especially paid content!"
    )
    pdf.setProducer("Web Printer: https://github.com/busiyiworld/web-printer")
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
    const outline = outlineItems
      .map(k => ({
        url: k.url,
        startPageIndex: k.num - 1
      }))
      .reverse()
      .reduce(
        (acc, { url, startPageIndex }) => {
          acc.items.push({
            pagesIndex: Array.from(
              { length: acc.lastIndex - startPageIndex },
              (_, k) => startPageIndex + k
            ),
            url: url
          })
          acc.lastIndex = startPageIndex
          return acc
        },
        {
          items: [],
          lastIndex: pages.length
        } as {
          items: { pagesIndex: number[]; url: string }[]
          /**
           * @default length
           */
          lastIndex: number
        }
      )
      .items.reverse()

    const hashTable: {
      value: string
      coordinate: number[]
      pageIndex: number
    }[] = []
    const linkTable: {
      url: string
      hash?: string
      pagesIndex: number[]
      ref: PDFRef
      refDict: PDFDict
    }[] = []

    pages.forEach((p, i) => {
      const annotes = p.node.Annots()?.asArray()
      if (annotes?.length) {
        for (const annote of annotes) {
          const dict = pdf.context.lookupMaybe(annote, PDFDict)
          if (!dict) continue
          const a = dict.get(PDFName.of(`A`))
          const link = pdf.context.lookupMaybe(a, PDFDict)
          const url = link?.get(PDFName.of("URI"))?.toString().slice(1, -1)
          if (url) {
            if (url.includes("https://web.printer/")) {
              const xy = dict
                .get(PDFName.of("Rect"))
                ?.toString()
                .slice(2, -2)
                .split(" ")
                .map(k => Number(k))
              if (xy) {
                hashTable.push({
                  value: url.replace("https://web.printer/", ""),
                  pageIndex: i,
                  coordinate: [xy[0], xy[1] + 30, 1]
                })
                pdf.context.assign(annote as PDFRef, pdf.context.obj({}))
              }
            } else if (url.includes("https://self.web.printer/")) {
              const item = outline.find(k => k.pagesIndex.includes(i))
              item &&
                linkTable.push({
                  hash: url.replace("https://self.web.printer/", ""),
                  ref: annote as PDFRef,
                  refDict: dict,
                  ...item
                })
              continue
            } else {
              const item = outline.find(
                k =>
                  url.replace(/\/?[#?].+$/, "") ===
                  k.url.replace(/\/?[#?].+$/, "")
              )
              if (item) {
                const hash = url.replace(/^.+#(.+)$/, "$1")
                linkTable.push({
                  hash: hash === url ? undefined : hash,
                  ref: annote as PDFRef,
                  refDict: dict,
                  ...item
                })
              }
            }
          }
        }
      }
    })

    linkTable.forEach(({ hash, ref, refDict, pagesIndex }) => {
      const obj = {
        Type: "Annot",
        Subtype: "Link",
        Rect: refDict.lookup(PDFName.of("Rect")),
        Border: refDict.lookup(PDFName.of("Border")),
        C: refDict.lookup(PDFName.of("C")),
        Dest: [pages[pagesIndex[0]].ref, "XYZ", null, null, null] as any[]
      }
      if (hash) {
        const ret = hashTable.find(
          k => pagesIndex.includes(k.pageIndex) && hash === k.value
        )
        if (ret) {
          obj.Dest = [pages[ret.pageIndex].ref, "XYZ", ...ret.coordinate]
        }
      }
      pdf.context.assign(ref, pdf.context.obj(obj))
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
