// audit_clues.js — Clue-generating helpers for ISBN audit
// Extracted from audit.js to decompose the 118-line file into focused modules
// Each function inspects a potentially invalid ISBN and pushes diagnostic clues

const parse = require('./parse')
const calculateCheckDigit = require('./calculate_check_digit')
const getGroup = require('./get_group')
const groups = require('./groups')
const splitIsbnParts = require('./split_isbn_parts')

/**
 * Format a candidate ISBN result for inclusion in a clue.
 * Returns only the relevant ISBN fields (isbn10 omitted for 979-prefix ISBNs).
 */
function formatCandidate (candidateData) {
  const { isbn13h, isbn13, isbn10h, isbn10, groupname } = candidateData
  if (isbn10h) {
    return { isbn13h, isbn13, isbn10h, isbn10, groupname }
  } else {
    return { isbn13h, isbn13, groupname }
  }
}

/**
 * Look for possible reasons why an ISBN is invalid.
 * Checks group membership, publisher ranges, and checksums.
 */
function lookForPossibleInvalidityCauses (normalizedIsbn, clues) {
  const foundGroup = getGroup(normalizedIsbn)
  if (foundGroup) {
    const { groupPrefix } = foundGroup
    const groupInfo = groups[groupPrefix]
    const partsData = splitIsbnParts(normalizedIsbn)
    if (partsData) {
      const candidateBase = normalizedIsbn.slice(0, -1)
      const checkDigit = calculateCheckDigit(candidateBase)
      const candidateData = parse(`${candidateBase}${checkDigit}`)
      const message = "Found a matching group and publisher range, but the checksum didn't match. Could the checksum be wrong?"
      clues.push({ message, candidate: formatCandidate(candidateData) })
    } else {
      clues.push({ message: 'Found a matching group but no matching publisher range', group: { prefix: groupPrefix, name: groupInfo.name } })
    }
  } else {
    clues.push({ message: 'Could not find a matching ISBN group' })
  }

  if (normalizedIsbn.length === 13) {
    if (normalizedIsbn.startsWith('978')) {
      guessPrefixFromChecksum(normalizedIsbn, '979', clues)
      guessUnprefixedFromChecksum(normalizedIsbn, clues)
    } else if (normalizedIsbn.startsWith('979')) {
      guessPrefixFromChecksum(normalizedIsbn, '978', clues)
    }
  } else if (normalizedIsbn.length === 10) {
    guessMissingPrefixFromChecksum(normalizedIsbn, '978', clues)
    guessMissingPrefixFromChecksum(normalizedIsbn, '979', clues)
  }
}

/**
 * Consider an alternative prefix (978↔979) for a valid ISBN.
 * If the ISBN is valid under the other prefix, add a clue about the possible prefix error.
 */
function considerAltPrefix (normalizedIsbn, altPrefix, clues) {
  const candidateBase = `${altPrefix}${normalizedIsbn.substring(3, 12)}`
  const checkDigit = calculateCheckDigit(candidateBase)
  const candidateData = parse(`${candidateBase}${checkDigit}`)
  if (candidateData != null) {
    clues.push({ message: 'Possible prefix error', candidate: formatCandidate(candidateData) })
  }
}

/**
 * Guess that the ISBN might have a different prefix based on the checksum.
 * Tests the same digits under an alternative prefix.
 */
function guessPrefixFromChecksum (normalizedIsbn, altPrefix, clues) {
  const altPrefixIsbn = `${altPrefix}${normalizedIsbn.substring(3)}`
  const altPrefixData = parse(altPrefixIsbn)
  if (altPrefixData != null) {
    clues.push({ message: 'Checksum hints different prefix', candidate: formatCandidate(altPrefixData) })
  }
}

/**
 * Guess that a 978 prefix was added to an ISBN-10 without updating the checksum.
 * Tests by stripping the prefix and parsing as ISBN-10.
 */
function guessUnprefixedFromChecksum (normalizedIsbn, clues) {
  const unprefixedIsbn = normalizedIsbn.substring(3)
  const unprefixData = parse(unprefixedIsbn)
  if (unprefixData != null) {
    clues.push({ message: 'Checksum hints that a 978 was added to an ISBN-10 without updating the checksum', candidate: formatCandidate(unprefixData) })
  }
}

/**
 * Guess that an ISBN-10 might be missing its ISBN-13 prefix.
 * Prepends the given prefix and tries to parse as ISBN-13.
 */
function guessMissingPrefixFromChecksum (normalizedIsbn, missingPrefix, clues) {
  const prefixedIsbn = `${missingPrefix}${normalizedIsbn}`
  const prefixData = parse(prefixedIsbn)
  if (prefixData != null) {
    clues.push({ message: `Checksum hints that it is an ISBN-13 without its ${missingPrefix} prefix`, candidate: formatCandidate(prefixData) })
  }
}

/**
 * Suggest a corrected checksum for an invalid ISBN.
 * Recomputes the check digit and parses the result.
 */
function suggestCorrectChecksum (normalizedIsbn, clues) {
  const candidateBase = normalizedIsbn.slice(0, -1)
  const checkDigit = calculateCheckDigit(candidateBase)
  const candidateData = parse(`${candidateBase}${checkDigit}`)
  if (candidateData != null) {
    const message = 'Maybe the problem is the invalid checksum?'
    clues.push({ message, candidate: formatCandidate(candidateData) })
  }
}

module.exports = {
  lookForPossibleInvalidityCauses,
  considerAltPrefix,
  guessPrefixFromChecksum,
  guessUnprefixedFromChecksum,
  guessMissingPrefixFromChecksum,
  suggestCorrectChecksum,
  formatCandidate
}
