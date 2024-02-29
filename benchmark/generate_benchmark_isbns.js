#!/usr/bin/env node
const groups = require('../lib/groups')
const calculateCheckDigit = require('../lib/calculate_check_digit')
const getRandomDigits = length => Math.random().toString().substring(2, 2 + length)
const generateIsbn = (prefix, group, publisher) => {
  const isbn13WithoutArticleAndCheck = `${prefix}${group}${publisher}`
  const articleLength = 12 - isbn13WithoutArticleAndCheck.length
  const article = getRandomDigits(articleLength)
  const check = calculateCheckDigit(`${prefix}${group}${publisher}${article}`)
  return `${prefix}${group}${publisher}${article}${check}`
}

const isbns = []

// Generate 2 ISBNs per known range boundaries
for (const groupPrefix in groups) {
  const [prefix, group] = groupPrefix.split('-')
  const groupData = groups[groupPrefix]
  for (const range of groupData.ranges) {
    const [min, max] = range
    isbns.push(generateIsbn(prefix, group, min))
    isbns.push(generateIsbn(prefix, group, min))
    isbns.push(generateIsbn(prefix, group, max))
    isbns.push(generateIsbn(prefix, group, max))
  }
}

module.exports = isbns
