import type { PDFDocument, PDFRef } from "@cantoo/pdf-lib"
import {
  PDFDict,
  PDFName,
  PDFPageLeaf,
  PDFArray,
  PDFHexString,
  PDFNull,
  PDFNumber
} from "@cantoo/pdf-lib"
import { genOriginOutlineData } from "./structure"
import type { OutlineItemOrigin } from "./typing"
export * from "./typing"

function getPageRefs(doc: PDFDocument) {
  const refs: PDFRef[] = []
  doc.catalog.Pages().traverse((kid, ref) => {
    if (kid instanceof PDFPageLeaf) refs.push(ref)
  })
  return refs
}

function createOutlineNode(
  doc: PDFDocument,
  _: {
    Title: PDFHexString
    Parent: PDFRef
    Prev?: PDFRef
    Next?: PDFRef
    First?: PDFRef
    Last?: PDFRef
    Count?: PDFNumber
    Dest: PDFArray
  }
) {
  const map = new Map()

  map.set(PDFName.Title, _.Title)
  map.set(PDFName.Parent, _.Parent)
  if (_.Prev !== undefined) map.set(PDFName.of("Prev"), _.Prev)
  if (_.Next !== undefined) map.set(PDFName.of("Next"), _.Next)
  if (_.First !== undefined) map.set(PDFName.of("First"), _.First)
  if (_.Last !== undefined) map.set(PDFName.of("Last"), _.Last)
  if (_.Count !== undefined) map.set(PDFName.of("Count"), _.Count)
  map.set(PDFName.of("Dest"), _.Dest)

  return PDFDict.fromMapWithContext(map, doc.context)
}

function createOutlineDict(
  doc: PDFDocument,
  _: {
    First: PDFRef
    Last: PDFRef
    Count: PDFNumber
  }
) {
  const outlinesDictMap = new Map()
  outlinesDictMap.set(PDFName.Type, PDFName.of("Outlines"))
  outlinesDictMap.set(PDFName.of("First"), _.First)
  outlinesDictMap.set(PDFName.of("Last"), _.Last)
  outlinesDictMap.set(PDFName.of("Count"), _.Count)

  return PDFDict.fromMapWithContext(outlinesDictMap, doc.context)
}

export function setOutline(pdf: PDFDocument, outline: OutlineItemOrigin[]) {
  const pageRefs = getPageRefs(pdf)
  // 第一个 ref
  const outlineRootRef = pdf.context.nextRef()
  //Pointing the "Outlines" property of the PDF "Catalog" to the first object of your outlines
  pdf.catalog.set(PDFName.of("Outlines"), outlineRootRef)

  const outlineItemRef: PDFRef[] = []
  const outlineItem: PDFDict[] = []

  // const outlineRootRef = outlinesDictRef;
  const pseudoOutlineItems = genOriginOutlineData(outline)

  for (let i = 0; i < pseudoOutlineItems.length; i++) {
    // 每一页
    outlineItemRef.push(pdf.context.nextRef())
  }

  for (let i = 0; i < pseudoOutlineItems.length; i++) {
    const { Title, Dest, Parent, Count, First, Last, Next, Prev, Coordinate } =
      pseudoOutlineItems[i]
    outlineItem[i] = createOutlineNode(pdf, {
      Title: PDFHexString.fromText(Title),
      Parent: Parent !== -1 ? outlineItemRef[Parent] : outlineRootRef,
      ...(Prev !== undefined && {
        Prev: outlineItemRef[Prev]
      }),
      ...(Next !== undefined && {
        Next: outlineItemRef[Next]
      }),
      ...(First !== undefined && { First: outlineItemRef[First] }),
      ...(Last !== undefined && { Last: outlineItemRef[Last] }),
      ...(Count !== undefined && { Count: PDFNumber.of(Count) }),
      Dest: (() => {
        const array: PDFArray = PDFArray.withContext(pdf.context)
        array.push(pageRefs[Dest])
        array.push(PDFName.of("XYZ"))
        Coordinate.forEach(k => {
          if (k === null) array.push(PDFNull)
          else array.push(PDFNumber.of(k))
        })
        return array
      })()
    })
  }

  const outlinesDict = createOutlineDict(pdf, {
    First: outlineItemRef[0],
    Last: outlineItemRef[pseudoOutlineItems.length - 1],
    Count: PDFNumber.of(pseudoOutlineItems.length)
  })

  //First 'Outline' object. Refer to table H.3 in Annex H.6 of PDF Specification doc.
  pdf.context.assign(outlineRootRef, outlinesDict)

  //Actual outline items that will be displayed
  for (let i = 0; i < pseudoOutlineItems.length; i++) {
    pdf.context.assign(outlineItemRef[i], outlineItem[i])
  }

  return pdf
}
