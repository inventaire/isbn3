#!/usr/bin/env node
import audit from '../audit.ts'

const [source] = process.argv.slice(2)

const parseIsbn = (str: string): string[] | null => str.match(/[\dX-]{10,17}/g)

const outputIsbnsWithClues = (isbns: string[]): void => {
  const isbnsWithClues = isbns
    .map((isbn) => audit(isbn))
    .filter((auditData) => auditData.clues.length > 0)
    .map((auditData) => JSON.stringify(auditData))
    .join('\n')
  if (isbnsWithClues.length > 0) process.stdout.write(`${isbnsWithClues}\n`)
}

// Prevent logging an EPIPE error when piping the output
// cf https://github.com/maxlath/wikidata-cli/issues/7
process.stdout.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code !== 'EPIPE' && err.code !== 'ERR_STREAM_DESTROYED') throw err
})

if (source != null) {
  const match = parseIsbn(source)?.[0]
  if (match) console.log(JSON.stringify(audit(match)))
} else {
  let remaining = ''
  process.stdin
    .on('data', (buf) => {
      const parts = (remaining + buf.toString()).split('\n')
      const isbns = parseIsbn(parts.slice(0, -1).join('\n')) ?? []
      remaining = parts.slice(-1)[0]
      outputIsbnsWithClues(isbns)
    })
    .on('close', () => {
      if (remaining.length > 0) outputIsbnsWithClues(parseIsbn(remaining) ?? [])
    })
}
