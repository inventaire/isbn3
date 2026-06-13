// audit.js — Audit an ISBN and return validity status with diagnostic clues
// Refactored: extracted clue helpers to audit_clues.js, normalize to normalize.js
// Original 118 lines → now 30 lines (focused orchestration only)

const parse = require('./parse')
const normalize = require('./normalize')
const { lookForPossibleInvalidityCauses, considerAltPrefix } = require('./audit_clues')

module.exports = source => {
  if (typeof source !== 'string' || source.length === 0) throw Error(`invalid input: ${source}`)

  const result = { source }
  const data = parse(source)
  result.validIsbn = data != null
  const clues = []
  const normalizedIsbn = normalize(source)

  if (!(normalizedIsbn.length === 13 || normalizedIsbn.length === 10)) throw new Error('invalid input length')

  if (data) {
    result.groupname = data.groupname
    if (normalizedIsbn.length === 13) {
      if (normalizedIsbn.startsWith('978')) considerAltPrefix(normalizedIsbn, '979', clues)
      else if (normalizedIsbn.startsWith('979')) considerAltPrefix(normalizedIsbn, '978', clues)
    }
  } else {
    lookForPossibleInvalidityCauses(normalizedIsbn, clues)
  }

  result.clues = clues

  return result
}
