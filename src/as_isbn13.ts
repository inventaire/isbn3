// as_isbn13.ts — Convert any valid ISBN to ISBN-13 format

import parse from './parse.js'

export default (val: unknown, hyphen?: boolean): string | null => {
  const data = parse(val)
  if (!data) return null
  return hyphen ? data.isbn13h : data.isbn13
}
