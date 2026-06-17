// index.ts — Main entry point for the isbn3 library

import asIsbn10 from './as_isbn10.js'
import asIsbn13 from './as_isbn13.js'
import audit from './audit.js'
import groups from './groups.js'
import hyphenate from './hyphenate.js'
import parse from './parse.js'

export type {
  Candidate,
  Clue,
  Group,
  Groups,
  ISBN,
  ISBNAudit,
} from './types.js'
export { asIsbn10, asIsbn13, audit, groups, hyphenate, parse }

export default { parse, audit, hyphenate, asIsbn13, asIsbn10, groups }
