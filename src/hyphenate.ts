// hyphenate.ts — Hyphenate an ISBN using correct group/publisher/article ranges

import parse from './parse.js'

export default (val: unknown): string | null => {
  const data = parse(val)
  if (!data) return null
  return data.isIsbn13 ? data.isbn13h : (data.isbn10h ?? null)
}
