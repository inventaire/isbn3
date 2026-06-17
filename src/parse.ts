// parse.ts — Parse an ISBN string and return structured data, or null

import completeIsbnData from './complete_isbn_data.js'
import splitIsbnParts from './split_isbn_parts.js'
import type { ISBN, IsbnDataDraft } from './types.js'

export default (value: unknown): ISBN | null => {
  if (value == null) return null
  const source = value.toString()
  if (!source) return null

  const normalized = source
    .replace(/\s/g, '')
    // Dropping all hyphens, as the hyphens might be wrong
    // Ex: only one can be true of 978-88-3282-181-9 and 978-88-328-2181-9
    .replace(/-/g, '')

  const parts = splitIsbnParts(normalized)
  if (!parts) return null

  const draft: IsbnDataDraft = {
    ...parts,
    source,
    isIsbn10: normalized.length !== 13,
    isIsbn13: normalized.length === 13,
  }

  if (normalized.length === 13) {
    draft.prefix = normalized.substring(0, 3)
  }

  const data = completeIsbnData(draft)
  if (!data) return null

  data.isValid = data.check === (data.isIsbn13 ? data.check13 : data.check10)

  return data.isValid ? (data as ISBN) : null
}
