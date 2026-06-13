// isbn.js — Main entry point for the isbn3 library
// Refactored: inline functions extracted to dedicated modules for cohesion

const parse = require('./lib/parse')
const audit = require('./lib/audit')
const hyphenate = require('./lib/hyphenate')
const asIsbn13 = require('./lib/as_isbn13')
const asIsbn10 = require('./lib/as_isbn10')

module.exports = {
  parse,
  audit,
  hyphenate,
  asIsbn13,
  asIsbn10,

  groups: require('./lib/groups')
}
