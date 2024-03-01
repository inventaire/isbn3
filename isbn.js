import { parse } from './lib/parse.js'
import { audit } from './lib/audit.js'
import { groups } from './lib/groups.js'

export { parse, audit, groups }

export function hyphenate (val) {
  const data = parse(val)
  if (!data) return null
  return data.isIsbn13 ? data.isbn13h : data.isbn10h
}

export function asIsbn13 (val, hyphen) {
  const data = parse(val)
  if (!data) return null
  return hyphen ? data.isbn13h : data.isbn13
}

export function asIsbn10 (val, hyphen) {
  const data = parse(val)
  if (!data) return null
  // Return null for cases where it shouldn't map to an ISBN 10
  // ex: 979-10-91146-13-5
  if (!data.isbn10) return null
  return hyphen ? data.isbn10h : data.isbn10
}

export default { parse, audit, groups, hyphenate, asIsbn13, asIsbn10 }
