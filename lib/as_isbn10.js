// as_isbn10.js — Convert any valid ISBN to ISBN-10 format
// Extracted from isbn.js inline function for better cohesion and testability
// Returns null for 979-prefix ISBNs that have no ISBN-10 equivalent

const parse = require('./parse')

module.exports = (val, hyphen) => {
  const data = parse(val)
  if (!data) return null
  // Return null for cases where it shouldn't map to an ISBN 10
  // ex: 979-10-91146-13-5
  if (!data.isbn10) return null
  return hyphen ? data.isbn10h : data.isbn10
}
