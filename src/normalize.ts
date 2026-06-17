// normalize.ts — Strip non-digit/non-X characters from an ISBN string

export default (input: string): string => input.replace(/[^\dX]/g, '')
