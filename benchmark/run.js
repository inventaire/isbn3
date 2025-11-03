#!/usr/bin/env node
console.time('load module')
// To compare with isbn2 use, run `npm i --no-save isbn2`
// and replace the following line by:
// const { parse } = require('isbn2').ISBN
const { parse } = require('..')

console.timeEnd('load module')

const isbns = require('./generate_benchmark_isbns')

const repeat = 100
const parseTimerKey = `parsed ${isbns.length * repeat} non-hyphenated ISBNs in`

console.time(parseTimerKey)

for (let i=0; i<repeat; i++) {
  // Wrapper function needed for running with isbn2 parse function
  // which would interpret the map second argument as a group whitelist
  const data = isbns.map(isbn => parse(isbn))
}

console.timeEnd(parseTimerKey)
