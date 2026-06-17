#!/usr/bin/env node
import calculateCheckDigit from '../calculate_check_digit.js'
import parse from '../parse.js'

const [input, option] = process.argv.slice(2)

let normalized = input.replace(/[^\dX]/g, '')
if (normalized.length === 10) normalized = normalized.substring(0, 9)
else if (normalized.length === 13) normalized = normalized.substring(0, 12)

const checksum = calculateCheckDigit(normalized)
const isbnData = parse(`${normalized}${checksum}`)
if (isbnData == null) {
  process.stderr.write('invalid ISBN despite recalculated checksum\n')
  process.exit(1)
}

if (option === 'c') {
  process.stdout.write(String(checksum))
} else {
  const data = { input, checksumCalculatedFrom: normalized, checksum, isbn: isbnData.isbn13h }
  process.stdout.write(`${JSON.stringify(data)}\n`)
}
