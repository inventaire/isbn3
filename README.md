# isbn3

[![Node](https://img.shields.io/badge/node->=v6.4.0-brightgreen.svg)](http://nodejs.org)

An ISBN JavaScript Library.

Please note that this is a fork of [isbn2](https://www.npmjs.com/package/isbn2), which was a fork of [isbn](https://www.npmjs.com/package/isbn) package which was forked from the original [isbnjs](https://code.google.com/p/isbnjs/) project on Google Code.

[Ranges data](https://github.com/inventaire/isbn3/blob/main/lib/groups.js) are generated from [isbn-international.org](https://www.isbn-international.org) data.

Added features compared to `isbn2`:
* recover common errors:
  * ignore bad hyphenization (ex: `978-1933988030`)
* modularizing and updating the code for ES6, in a class-less way.
* improve performance (see [benchmark](#benchmark))
* [Auto-update groups data](https://github.com/inventaire/isbn3/issues/5#issuecomment-667523086) every month

[Demo](http://inventaire.github.io/isbn3/)

[![NPM](https://nodei.co/npm/isbn3.png?stars&downloads&downloadRank)](https://npmjs.com/package/isbn3/)

![Auto-update groups data](https://github.com/inventaire/isbn3/actions/workflows/auto_update_groups_data.yml/badge.svg)

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Functions](#functions)
  - [parse](#parse)
  - [asIsbn13](#asisbn13)
  - [asIsbn10](#asisbn10)
  - [hyphenate](#hyphenate)
  - [audit](#audit)
  - [groups](#groups)
- [CLI](#cli)
  - [isbn](#isbn)
  - [isbn-audit](#isbn-audit)
  - [isbn-checksum](#isbn-checksum)
- [Benchmark](#benchmark)
- [Development](#development)
  - [Test Suite](#test-suite)
  - [Update Groups](#update-groups)
- [See also](#see-also)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

From the command line:
```sh
npm install isbn3
```

Then in your JS file:

```js
const ISBN = require('isbn3')
```

Alternatively, you can call the ES5 browserified version of the module from an HTML file, which sets the module object on `window.ISBN`:
```html
<script type="application/javascript" src="./node_modules/dist/isbn.js"></script>
```

See `./index.html` or the [live demo](http://inventaire.github.io/isbn3/) for an example.

## Functions

### parse

```js
ISBN.parse('1-933988-03-7')
// => {
// source: '1-933988-03-7',
// isValid: true,
// isIsbn10: true,
// isIsbn13: false,
// group: '1',
// publisher: '933988',
// article: '03',
// check: '7',
// isbn13: '9781933988030',
// isbn13h: '978-1-933988-03-0',
// check10: '7',
// check13: '0',
// groupname: 'English language',
// hasIsbn10: true,
// isbn10: '1933988037',
// isbn10h: '1-933988-03-7'
// }

ISBN.parse('1933988037')
// => idem but with source === '1933988037'

ISBN.parse('978-4-87311-336-4')
// => {
//   source: '978-4-87311-336-4',
//   isValid: true,
//   isIsbn10: false,
//   isIsbn13: true,
//   prefix: '978',
//   group: '4',
//   publisher: '87311',
//   article: '336',
//   check: '4',
//   isbn13: '9784873113364',
//   isbn13h: '978-4-87311-336-4',
//   check10: '9',
//   check13: '4',
//   groupname: 'Japan',
//   hasIsbn10: true,
//   isbn10: '4873113369',
//   isbn10h: '4-87311-336-9'
// }

ISBN.parse('9784873113364')
// => idem but with source === '9784873113364'

ISBN.parse('978-4873113364')
// => idem but with source === '978-4873113364'

ISBN.parse('979-10-96908-02-8')
// {
//   source: '979-10-96908-02-8',
//   isValid: true,
//   isIsbn10: false,
//   isIsbn13: true,
//   prefix: '979',
//   group: '10',
//   publisher: '96908',
//   article: '02',
//   check: '8',
//   isbn13: '9791096908028',
//   isbn13h: '979-10-96908-02-8',
//   check10: '6',
//   check13: '8',
//   groupname: 'France',
//   hasIsbn10: false
// }

ISBN.parse('not an isbn')
// => null
```

### asIsbn13
```js
ISBN.asIsbn13('4-87311-336-9')           // 9784873113364
ISBN.asIsbn13('4-87311-336-9', true)     // 978-4-87311-336-4
```

### asIsbn10
```js
ISBN.asIsbn10('978-4-87311-336-4')       // 4873113369
ISBN.asIsbn10('978-4-87311-336-4', true) // 4-87311-336-9
```

### hyphenate
```js
ISBN.hyphenate('9784873113364')          // 978-4-87311-336-4
```

### audit
Get clues for possible mistake in an ISBN.

For instance, if in your data, a French edition has an ISBN-13 starting by `978-1-0`, which would make it part of an English language groups, it could be that somewhere a prefix mistake was made and the ISBN actually starts by `979-10` (a French group). This is typically the case when an 979-prefix ISBN-13 was converted to an ISBN-10 (which is wrong as 979-prefixed ISBNs can't have ISBN-10), and then re-converted to an ISBN-13 with the 978 prefix. This is soooo wrong, but data is a dirty place I'm afraid.
```js
ISBN.audit('9784873113364')
// {
//   "source": "9784873113364",
//   "validIsbn": true,
//   "groupname": "Japan",
//   "clues": []
// }

ISBN.audit('9781090648525')
// {
//   "source": "9781090648525",
//   "validIsbn": true,
//   "groupname": "English language",
//   "clues": [
//     {
//       "message": "Possible prefix error",
//       "candidate": {
//         "isbn13h": "979-10-90648-52-4",
//         "isbn13": "9791090648524",
//         "groupname": "France"
//       }
//     }
//   ]
// }

ISBN.audit('978-1-0906-4852-4')
// {
//   "source": "978-1-0906-4852-4",
//   "validIsbn": false,
//   "clues": [
//     {
//       "message": "Found a matching group and publisher range, but the checksum didn't match. Could the checksum be wrong?",
//       "candidate": {
//         "isbn13h": "978-1-0906-4852-5",
//         "isbn13": "9781090648525",
//         "isbn10h": "1-0906-4852-9",
//         "isbn10": "1090648529",
//         "groupname": "English language"
//       }
//     },
//     {
//       "message": "Checksum hints different prefix",
//       "candidate": {
//         "isbn13h": "979-10-90648-52-4",
//         "isbn13": "9791090648524",
//         "groupname": "France"
//       }
//     }
//   ]
// }
```

### groups
```js
ISBN.groups['978-99972']
// => {
//   name: 'Faroe Islands',
//   ranges: [ [ '0', '4' ], [ '50', '89' ], [ '900', '999' ] ]
// }
```

## CLI

Installing the module globally (`npm install -g isbn3`) will make the following commands available from your terminal.

If you installed locally (`npm install isbn3`), the command can be accessed from the project directory at `./node_modules/.bin`, or just by their filename in npm scripts.

### isbn
```sh
isbn <isbn> <format>

Valid ISBN input examples:
- 9781491574317
- 978-1-4915-7431-7
- 978-1491574317
- isbn:9781491574317
- 9781-hello-491574317
- 030433376X
- 0-304-33376-X

Formats:
- h: hyphen
- n: no hyphen
- 13: ISBN-13 without hyphen
- 13h: ISBN-13 with hyphen (default)
- 10: ISBN-10 without hyphen
- 10h: ISBN-10 with hyphen
- prefix, group, publisher, article, check, check10, check13: output ISBN part value
- data: output all this data as JSON
```

### isbn-audit
Return the results of the [audit](#audit) function as JSON

```sh
isbn-audit <isbn>
```

This command also accepts a stream of newline-delimited isbns and outputs a stream of newline-delimited JSON, where each line corresponds to an ISBN that is either invalid or that could be suspect of being malformed. Valid ISBN with no possible malformation detected don't return anything.
echo '
9784873113364
9781090648525
978-1-0906-4852-4
' | isbn-audit > audit_data.ndjson

### isbn-checksum
Return the checksum that would correspond to the passed input (ignoring its current checksum if any).

```sh
isbn-checksum <isbn>

isbn-checksum 978-4-87311-336-4
# {
#   "input": "978-4-87311-336-4",
#   "checksumCalculatedFrom": "978487311336",
#   "checksum": "4",
#   "isbn": "978-4-87311-336-4"
# }

isbn-checksum 978-4-87311-336-1
# {
#   "input": "978-4-87311-336-1",
#   "checksumCalculatedFrom": "978487311336",
#   "checksum": "4",
#   "isbn": "978-4-87311-336-4"
# }

isbn-checksum 978-4-87311-336
# {
#   "input": "978-4-87311-336",
#   "checksumCalculatedFrom": "978487311336",
#   "checksum": "4",
#   "isbn": "978-4-87311-336-4"
# }

isbn-checksum 978487311336
# {
#   "input": "978487311336",
#   "checksumCalculatedFrom": "978487311336",
#   "checksum": "4",
#   "isbn": "978-4-87311-336-4"
# }


isbn-checksum 978-4-87311-336-1
```

## Benchmark
Indicative benchmark, nothing super scientific, YMMV.

Running `npm run benchmark` a few times on some Linux machine with Node.Js `v8.12` produced in average the following mesure:

* isbn3
- load module: 6ms
- parse 4960 non-hyphenated ISBNs in around 110ms

* [isbn2](https://www.npmjs.com/package/isbn2) (for comparison)
- load module: 4.5ms
- parse 4960 non-hyphenated ISBNs in around 285ms

The difference is mainly due to the [generation of a map of groups in `isbn3`](https://github.com/inventaire/isbn3/blob/main/lib/get_group.js), which takes more time a initialization but makes groups lookups much faster.

## Development

### Test Suite

To run the lint/test suite use:

```sh
npm test
```

### Update Groups data

[Groups data](https://github.com/inventaire/isbn3/blob/main/lib/groups.js) are fetched from isbn-international.org, and are critical to how this lib parses ISBNs. Unfortunately, those groups aren't fixed once for all, and we need to update those data periodically.

Once a month, a [CI job](https://github.com/inventaire/isbn3/blob/main/.github/workflows/auto_update_groups_data.yml) takes care of updating ISBN groups data and publishing a patch version:
![Auto-update groups data](https://github.com/inventaire/isbn3/workflows/Update%20groups%20and%20publish/badge.svg)

To get the latest data, you thus just need to update to the latest version (beware of [breaking changes](https://github.com/inventaire/isbn3/blob/main/CHANGELOG.md) if that makes you switch to a new major version though):

```sh
npm install isbn3@latest
```

## See also
* [isbn-groups](https://www.npmjs.com/package/isbn-groups): infer a language from an ISBN group
