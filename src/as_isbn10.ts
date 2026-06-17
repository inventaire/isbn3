// as_isbn10.ts — Convert any valid ISBN to ISBN-10 format
// Returns null for 979-prefix ISBNs that have no ISBN-10 equivalent

import parse from './parse.ts'

export default (val: unknown, hyphen?: boolean): string | null => {
  const data = parse(val)
  if (!data) return null
  // Return null for cases where it shouldn't map to an ISBN 10
  // ex: 979-10-91146-13-5
  if (!data.isbn10) return null
  return hyphen ? (data.isbn10h ?? null) : data.isbn10
}
