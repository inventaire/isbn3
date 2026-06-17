#!/usr/bin/env node
// ESM imports are hoisted, so use dynamic import to measure module load time.
console.time('load module')
const { parse } = await import('../src/index.ts')
console.timeEnd('load module')

const { default: isbns } = await import('./generate_benchmark_isbns.ts')

const repeat = 100
const parseTimerKey = `parsed ${isbns.length * repeat} non-hyphenated ISBNs in`

console.time(parseTimerKey)

for (let i = 0; i < repeat; i++) {
  isbns.map((isbn) => parse(isbn))
}

console.timeEnd(parseTimerKey)
