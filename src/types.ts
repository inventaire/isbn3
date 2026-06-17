// types.ts — Shared type definitions for the isbn3 library

/** A registration group: its agency name and the valid publisher ranges. */
export interface Group {
  name: string
  ranges: Array<[string, string]>
}

/** Map of `${prefix}-${group}` keys to their group data (see groups.ts). */
export type Groups = Record<string, Group>

/** The four parts an ISBN body is split into, before completion. */
export interface IsbnParts {
  group: string
  publisher: string
  article: string
  check: string
}

/** A fully parsed and valid ISBN. Returned by `parse`. */
export interface ISBN {
  source: string
  isValid: true
  isIsbn10: boolean
  isIsbn13: boolean
  /** Present for ISBN-13 input, absent for ISBN-10 input. */
  prefix?: string
  group: string
  publisher: string
  article: string
  check: string
  check10: string
  check13: string
  groupname: string
  isbn13: string
  isbn13h: string
  /** Absent for 979-prefixed ISBNs (no ISBN-10 equivalent). */
  isbn10?: string
  isbn10h?: string
}

/** A candidate ISBN suggested by the audit, included in a clue. */
export interface Candidate {
  isbn13h: string
  isbn13: string
  isbn10h?: string
  isbn10?: string
  groupname: string
}

/** A diagnostic clue produced by `audit`. */
export type Clue =
  | { message: string; candidate: Candidate }
  | { message: string; group: { prefix: string; name: string } }
  | { message: string }

/** The result returned by `audit`. */
export interface ISBNAudit {
  source: string
  validIsbn: boolean
  groupname?: string
  clues: Clue[]
}
