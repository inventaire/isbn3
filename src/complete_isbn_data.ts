// complete_isbn_data.ts — Compute the derived fields (group name, check digits,
// ISBN-10/13 plain and hyphenated) for a set of ISBN parts under a given prefix.

import calculateCheckDigit from './calculate_check_digit.ts'
import groups from './groups.ts'
import type { IsbnParts } from './types.ts'

/** The fields derived from the ISBN parts, added on top of them by `parse`. */
export interface CompletedIsbnData {
  groupname: string
  check10: string
  check13: string
  isbn13: string
  isbn13h: string
  /** Absent for 979-prefixed ISBNs (no ISBN-10 equivalent). */
  isbn10?: string
  isbn10h?: string
}

export default ({ group, publisher, article }: IsbnParts, prefix: string): CompletedIsbnData | null => {
  const groupRecord = groups[`${prefix}-${group}`]
  if (!groupRecord) return null

  const isbn10WithoutCheck = `${group}${publisher}${article}`
  const check10 = calculateCheckDigit(isbn10WithoutCheck)
  if (!check10) return null
  const check13 = calculateCheckDigit(`${prefix}${isbn10WithoutCheck}`)
  if (!check13) return null

  return {
    groupname: groupRecord.name,
    check10,
    check13,
    isbn13: `${prefix}${group}${publisher}${article}${check13}`,
    isbn13h: `${prefix}-${group}-${publisher}-${article}-${check13}`,
    // 979-prefixed ISBNs have no ISBN-10 equivalent, so omit those fields.
    ...(prefix === '978' && {
      isbn10: `${group}${publisher}${article}${check10}`,
      isbn10h: `${group}-${publisher}-${article}-${check10}`,
    }),
  }
}
