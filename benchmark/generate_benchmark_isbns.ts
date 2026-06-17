import calculateCheckDigit from '../src/calculate_check_digit.js'
import groups from '../src/groups.js'

const getRandomDigits = (length: number): string =>
  Math.random()
    .toString()
    .substring(2, 2 + length)

const generateIsbn = (prefix: string, group: string, publisher: string): string => {
  const isbn13WithoutArticleAndCheck = `${prefix}${group}${publisher}`
  const articleLength = 12 - isbn13WithoutArticleAndCheck.length
  const article = getRandomDigits(articleLength)
  const check = calculateCheckDigit(`${prefix}${group}${publisher}${article}`)
  return `${prefix}${group}${publisher}${article}${check}`
}

const isbns: string[] = []

// Generate 2 ISBNs per known range boundary
for (const groupPrefix in groups) {
  const [prefix, group] = groupPrefix.split('-')
  const groupData = groups[groupPrefix]
  for (const [min, max] of groupData.ranges) {
    isbns.push(generateIsbn(prefix, group, min))
    isbns.push(generateIsbn(prefix, group, min))
    isbns.push(generateIsbn(prefix, group, max))
    isbns.push(generateIsbn(prefix, group, max))
  }
}

export default isbns
