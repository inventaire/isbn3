const groups = require('./groups')
const calculateCheckDigit = require('./calculate_check_digit')

module.exports = codes => {
  if (!codes) return null

  const prefix = codes.prefix || '978'
  const { group, publisher, article } = codes

  const groupRecord = groups[`${prefix}-${group}`]
  if (!groupRecord) return null

  codes.groupname = groupRecord.name

  const isbn10WithoutCheck = `${group}${publisher}${article}`

  const check10 = codes.check10 = calculateCheckDigit(isbn10WithoutCheck)
  if (!check10) return null

  const check13 = codes.check13 = calculateCheckDigit(prefix + isbn10WithoutCheck)
  if (!check13) return null

  codes.isbn13 = `${prefix}${group}${publisher}${article}${check13}`
  codes.isbn13h = `${prefix}-${group}-${publisher}-${article}-${check13}`

  if (prefix === '978') {
    codes.isbn10 = `${group}${publisher}${article}${check10}`
    codes.isbn10h = `${group}-${publisher}-${article}-${check10}`
  }

  return codes
}
