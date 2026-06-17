// complete_isbn_data.ts — Fill computed fields (check digits, ISBN-10/13
// plain and hyphenated) on a parsed ISBN draft.

import calculateCheckDigit from './calculate_check_digit.js'
import groups from './groups.js'
import type { IsbnDataDraft } from './types.js'

export default (codes: IsbnDataDraft | null): IsbnDataDraft | null => {
  if (!codes) return null

  const prefix = codes.prefix || '978'
  const { group, publisher, article } = codes

  const groupRecord = groups[`${prefix}-${group}`]
  if (!groupRecord) return null

  codes.groupname = groupRecord.name

  const isbn10WithoutCheck = `${group}${publisher}${article}`

  const check10 = calculateCheckDigit(isbn10WithoutCheck) ?? undefined
  codes.check10 = check10
  if (!check10) return null

  const check13 = calculateCheckDigit(prefix + isbn10WithoutCheck) ?? undefined
  codes.check13 = check13
  if (!check13) return null

  codes.isbn13 = `${prefix}${group}${publisher}${article}${check13}`
  codes.isbn13h = `${prefix}-${group}-${publisher}-${article}-${check13}`

  if (prefix === '978') {
    codes.isbn10 = `${group}${publisher}${article}${check10}`
    codes.isbn10h = `${group}-${publisher}-${article}-${check10}`
  }

  return codes
}
