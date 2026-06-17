// audit_clues.ts — Clue-generating helpers for ISBN audit
// Each function inspects a potentially invalid ISBN and pushes diagnostic clues

import calculateCheckDigit from './calculate_check_digit.ts'
import getGroup from './get_group.ts'
import groups from './groups.ts'
import parse from './parse.ts'
import splitIsbnParts from './split_isbn_parts.ts'
import type { Candidate, Clue, ISBN } from './types.ts'

/**
 * Format a candidate ISBN result for inclusion in a clue.
 * Returns only the relevant ISBN fields (isbn10 omitted for 979-prefix ISBNs).
 */
export function formatCandidate(candidateData: ISBN): Candidate {
  const { isbn13h, isbn13, isbn10h, isbn10, groupname } = candidateData
  if (isbn10h) return { isbn13h, isbn13, isbn10h, isbn10, groupname }
  return { isbn13h, isbn13, groupname }
}

/**
 * Parse `isbn` and, if it is a valid ISBN, push a clue carrying `message` and
 * the resulting candidate. This is the shared shape of every audit guess: build
 * a tentative ISBN, then keep it only if it actually parses.
 */
function pushCandidate(message: string, isbn: string, clues: Clue[]): void {
  const data = parse(isbn)
  if (data) clues.push({ message, candidate: formatCandidate(data) })
}

/** Replace the last digit of `base` with a freshly computed check digit. */
function withRecomputedChecksum(base: string): string {
  return `${base}${calculateCheckDigit(base) ?? ''}`
}

/**
 * Consider an alternative prefix (978↔979) for a valid ISBN.
 * If the digits yield a valid ISBN under the other prefix, flag a prefix error.
 */
export function considerAltPrefix(normalizedIsbn: string, altPrefix: string, clues: Clue[]): void {
  pushCandidate(
    'Possible prefix error',
    withRecomputedChecksum(`${altPrefix}${normalizedIsbn.substring(3, 12)}`),
    clues,
  )
}

/**
 * Look for possible reasons why an ISBN is invalid.
 * Checks group membership, publisher ranges, and checksums.
 */
export function lookForPossibleInvalidityCauses(normalizedIsbn: string, clues: Clue[]): void {
  const foundGroup = getGroup(normalizedIsbn)
  if (!foundGroup) {
    clues.push({ message: 'Could not find a matching ISBN group' })
  } else if (splitIsbnParts(normalizedIsbn)) {
    pushCandidate(
      "Found a matching group and publisher range, but the checksum didn't match. Could the checksum be wrong?",
      withRecomputedChecksum(normalizedIsbn.slice(0, -1)),
      clues,
    )
  } else {
    const groupInfo = groups[foundGroup.groupPrefix]
    if (groupInfo) {
      clues.push({
        message: 'Found a matching group but no matching publisher range',
        group: { prefix: foundGroup.groupPrefix, name: groupInfo.name },
      })
    }
  }

  if (normalizedIsbn.length === 13) {
    const rest = normalizedIsbn.substring(3)
    if (normalizedIsbn.startsWith('978')) {
      pushCandidate('Checksum hints different prefix', `979${rest}`, clues)
      pushCandidate('Checksum hints that a 978 was added to an ISBN-10 without updating the checksum', rest, clues)
    } else if (normalizedIsbn.startsWith('979')) {
      pushCandidate('Checksum hints different prefix', `978${rest}`, clues)
    }
  } else if (normalizedIsbn.length === 10) {
    pushCandidate('Checksum hints that it is an ISBN-13 without its 978 prefix', `978${normalizedIsbn}`, clues)
    pushCandidate('Checksum hints that it is an ISBN-13 without its 979 prefix', `979${normalizedIsbn}`, clues)
  }
}
