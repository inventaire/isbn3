// index.ts — Main entry point for the isbn3 library

import asIsbn10 from './as_isbn10.ts'
import asIsbn13 from './as_isbn13.ts'
import audit from './audit.ts'
import groups from './groups.ts'
import hyphenate from './hyphenate.ts'
import parse from './parse.ts'

export type {
  Candidate,
  Clue,
  Group,
  Groups,
  ISBN,
  ISBNAudit,
} from './types.ts'
export { asIsbn10, asIsbn13, audit, groups, hyphenate, parse }

export default { parse, audit, hyphenate, asIsbn13, asIsbn10, groups }
