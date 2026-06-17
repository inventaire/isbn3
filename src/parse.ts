// parse.ts — Parse an ISBN string and return structured data, or null

import completeIsbnData from './complete_isbn_data.ts'
import splitIsbnParts from './split_isbn_parts.ts'
import type { ISBN } from './types.ts'

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

  const isIsbn13 = normalized.length === 13
  // ISBN-10 input has no prefix of its own; it maps to the 978 range.
  const prefix = isIsbn13 ? normalized.substring(0, 3) : '978'

  const completed = completeIsbnData(parts, prefix)
  if (!completed) return null

  const isValid = parts.check === (isIsbn13 ? completed.check13 : completed.check10)
  if (!isValid) return null

  return {
    source,
    isValid: true,
    isIsbn10: !isIsbn13,
    isIsbn13,
    // The prefix is only meaningful (and reported) for ISBN-13 input.
    ...(isIsbn13 && { prefix }),
    ...parts,
    ...completed,
  }
}
