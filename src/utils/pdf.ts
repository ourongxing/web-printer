import { outlinePdfFactory } from "@lillallol/outline-pdf"
import * as pdfLib from "pdf-lib"

export async function mergePDF(pdfs: { buffer: ArrayBuffer; title: string }[]) {
  const mergedPdf = await pdfLib.PDFDocument.create()
  const outline: { num: number; title: string }[] = []
  for (let pdf of pdfs) {
    outline.push({
      num: mergedPdf.getPageCount() + 1,
      title: pdf.title
    })
    const doc = await pdfLib.PDFDocument.load(pdf.buffer)
    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices())
    copiedPages.forEach(page => mergedPdf.addPage(page))
  }

  // 7||Title
  const outlinedPDF = await outlinePdfFactory(pdfLib)({
    outline: outline.map(({ num, title }) => `${num}||${title}`).join("\n"),
    pdf: mergedPdf
  })

  return await outlinedPDF.save()
}
