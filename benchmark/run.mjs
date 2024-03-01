#!/usr/bin/env node
console.time("load module");
// To compare with isbn2 use, run `npm i --no-save isbn2`
// and replace the following line by:
// const { parse } = require('isbn2').ISBN
import {parse} from "../isbn.js";

console.timeEnd("load module");

import {isbns} from "./generate_benchmark_isbns.mjs";

const parseTimerKey = `parsed ${isbns.length} non-hyphenated ISBNs in`;

console.time(parseTimerKey);

// Wrapper function needed for running with isbn2 parse function
// which would interpret the map second argument as a group whitelist
const data = isbns.map((isbn) => parse(isbn));

console.timeEnd(parseTimerKey);
