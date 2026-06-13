// as_isbn13.js — Convert any valid ISBN to ISBN-13 format
// Extracted from isbn.js inline function for better cohesion and testability

const parse = require('./parse')

module.exports = (val, hyphen) => {
  const data = parse(val)
  if (!data) return null
  return hyphen ? data.isbn13h : data.isbn13
}
