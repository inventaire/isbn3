// hyphenate.js — Hyphenate an ISBN using correct group/publisher/article ranges
// Extracted from isbn.js inline function for better cohesion and testability

const parse = require('./parse')

module.exports = val => {
  const data = parse(val)
  if (!data) return null
  return data.isIsbn13 ? data.isbn13h : data.isbn10h
}
