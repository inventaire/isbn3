// parse.js — Parse an ISBN string and return structured data
// Updated to use renamed complete_isbn_data module

const completeIsbnData = require('./complete_isbn_data')
const splitIsbnParts = require('./split_isbn_parts')

module.exports = value => {
  if (value == null) return null
  value = value.toString()
  const source = value
  if (!value) return null

  value = value
    .replace(/\s/g, '')
    // Dropping all hyphens, as the hyphens might be wrong
    // Ex: only one can be true of 978-88-3282-181-9 and 978-88-328-2181-9
    .replace(/-/g, '')

  let data = splitIsbnParts(value)

  if (!data) return null

  data.source = source
  if (value.length === 13) {
    data.prefix = value.substring(0, 3)
    data.isIsbn13 = true
    data.isIsbn10 = false
  } else {
    data.isIsbn10 = true
    data.isIsbn13 = false
  }

  data = completeIsbnData(data)
  if (!data) return null

  data.isValid = data.check === (data.isIsbn13 ? data.check13 : data.check10)

  if (data.isValid) return data
  else return null
}
