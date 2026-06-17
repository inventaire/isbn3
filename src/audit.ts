// audit.ts — Audit an ISBN and return validity status with diagnostic clues

import { considerAltPrefix, lookForPossibleInvalidityCauses } from './audit_clues.ts'
import normalize from './normalize.ts'
import parse from './parse.ts'
import type { Clue, ISBNAudit } from './types.ts'

export default (source: string): ISBNAudit => {
  if (typeof source !== 'string' || source.length === 0) throw new Error(`invalid input: ${source}`)

  const data = parse(source)
  const result: ISBNAudit = { source, validIsbn: data != null, clues: [] }
  const clues: Clue[] = []
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
