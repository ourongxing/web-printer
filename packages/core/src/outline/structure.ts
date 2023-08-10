import type { OutlineItemOrigin, OutlineNode } from "./typing"

/**
 * @description It returns the number of descendant outline nodes of the provided outline node.
 */
function getNumberOfDescendants(
  outline: OutlineItemOrigin[],
  i: number
): number {
  let count = 0
  const contextDepth = outline[i].depth
  for (let ii = i + 1; ii < outline.length; ii++) {
    if (contextDepth < outline[ii].depth) {
      count++
    } else {
      break
    }
  }
  return count
}

/**
 * @description Returns a predicate on whether the provided outline node has a child.
 */
function hasChild(outline: OutlineItemOrigin[], i: number): boolean {
  if (i === outline.length - 1) return false
  return outline[i].depth + 1 === outline[i + 1].depth
}

/**
 * @description It returns the index of the parent of the provided outline node.
 * It returns `-1` when the provided outline node has zero depth.
 */
function getIndexOfImmediateParent(
  outline: OutlineItemOrigin[],
  i: number
): number {
  const contextDepth = outline[i].depth
  for (let ii = i; ii > -1; ii--) {
    if (contextDepth - 1 === outline[ii].depth) return ii
  }
  return -1
}

/**
 * @description It returns a predicate on whether the provided outline node has an immediate next sibling.
 */
function hasImmediateNextSibling(
  outline: OutlineItemOrigin[],
  i: number
): boolean {
  try {
    getIndexOfImmediateNextSibling(outline, i)
    return true
  } catch (e) {
    return false
  }
}

/**
 * @description It returns a predicate on whether the provided outline node has an immediate previous sibling.
 */
function hasImmediatePreviousSibling(
  outline: OutlineItemOrigin[],
  i: number
): boolean {
  try {
    getIndexOfImmediatePreviousSibling(outline, i)
    return true
  } catch (e) {
    return false
  }
}

/**
 * @description It returns the index of the immediate previous sibling for the provided outline node,
 * or throws if it does not find one.
 */
function getIndexOfImmediatePreviousSibling(
  outline: OutlineItemOrigin[],
  i: number
): number {
  const contextDepth: number = outline[i].depth
  for (let ii = i - 1; ii > -1; ii--) {
    if (outline[ii].depth < contextDepth) break
    if (outline[ii].depth === contextDepth) return ii
  }
  throw Error("error")
}

/**
 * @description It returns the index of the immediate next sibling for the specified outline node.
 * It throws if it does not exist.
 */
function getIndexOfImmediateNextSibling(
  outline: OutlineItemOrigin[],
  i: number
): number {
  const contextDepth = outline[i].depth
  for (let ii = i + 1; ii < outline.length; ii++) {
    if (outline[ii].depth < contextDepth) break
    if (outline[ii].depth === contextDepth) return ii
  }
  throw Error("error")
}

/**
 * @description Returns the index of the last immediate child for the provided outline node.
 * It throws if there is no child.
 */
function getIndexOfLastImmediateChild(
  outline: OutlineItemOrigin[],
  i: number
): number {
  let candidateIndex
  const parentDepth = outline[i].depth
  for (let ii = i + 1; ii < outline.length; ii++) {
    if (outline[ii].depth <= parentDepth) break
    if (outline[ii].depth === parentDepth + 1) candidateIndex = ii
  }
  if (candidateIndex === undefined) throw Error("error")
  return candidateIndex
}

/**
 * @description
 * It returns all the information needed to create a real pdf data structure.
 */
export function genOriginOutlineData(outline: OutlineItemOrigin[]) {
  return outline.reduce((acc, cur, i) => {
    acc.push({
      Title: cur.title,
      Parent: getIndexOfImmediateParent(outline, i),
      ...(hasImmediatePreviousSibling(outline, i) && {
        Prev: getIndexOfImmediatePreviousSibling(outline, i)
      }),
      ...(hasImmediateNextSibling(outline, i) && {
        Next: getIndexOfImmediateNextSibling(outline, i)
      }),
      ...(hasChild(outline, i) && {
        First: i + 1,
        Last: getIndexOfLastImmediateChild(outline, i),
        Count: getNumberOfDescendants(outline, i) * (cur.collapsed ? -1 : 1)
      }),
      Dest: cur.pageNumber - 1,
      Coordinate: cur.coordinate ?? [null, null, null]
    })
    return acc
  }, [] as OutlineNode[])
}
