# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 3.0.0 - 2026-06-16
**BREAKING CHANGES**:
  * The package is now **ESM-only**: consume it with `import` instead of `require`. CommonJS consumers must migrate to ESM or use a dynamic `await import('isbn3')`.
  * **Node.js >= 18** is now required (was `>= 6.4.0`).
  * The browserified UMD build (`./dist/isbn.js`, `./dist/isbn.min.js`, the `dist`/`gh-pages` branches and the `window.ISBN` global) has been removed. Load the package as an ES module from a CDN instead (e.g. `https://cdn.jsdelivr.net/npm/isbn3@3/+esm`).

**Other changes** (no API change — same functions, same output shape):
  * Source rewritten in **TypeScript**; accurate type declarations are now generated and bundled (`dist/index.d.ts`), replacing the hand-written `isbn.d.ts`. The `audit` clue `candidate` type is now correctly typed as an object (was `string`).
  * Tooling modernized: bundled with [tsdown](https://tsdown.dev) (Rolldown), tested with the built-in `node:test` runner, linted/formatted with [Biome](https://biomejs.dev); the groups updater now uses the native `fetch` (dropping `node-fetch`).

## 2.0.0- 2025-11-04
**BREAKING CHANGES**:
  * The [`audit`](https://github.com/inventaire/isbn3#audit) function output was changed to provide more details on the fixed ISBN candidate

## 1.2.0- 2024-09-16
* [`audit`](https://github.com/inventaire/isbn3#audit): more possibly recoverable cases added

## 1.1.0- 2020-04-24
* Add [`audit`](https://github.com/inventaire/isbn3#audit) function and corresponding [`isbn-audit`](https://github.com/inventaire/isbn3#isbn-audit) CLI command
* Add [`isbn-checksum`](https://github.com/inventaire/isbn3#isbn-checksum) CLI command
* Add dist files `./dist/isbn.js` and `./dist/isbn.min.js`, both being browserified ES5 versions of the module

## 1.0.0 - 2019-10-07
Fork from [isbn2](https://www.npmjs.com/package/isbn2)

**BREAKING CHANGES**
* accept approximately formatted ISBNs such as '978-4873113364' that would previously have return a `null` result
* functions are now directly exposed on the module object:
```js
require('isbn2').ISBN.parse('1933988037').codes.isbn13h // => '978-1-933988-03-0'
// becomes
require('isbn3').parse('1933988037').isbn13h // => '978-1-933988-03-0'
```

** Added features**
* added a [command-line interface](https://github.com/inventaire/isbn3#CLI)
* [expose groups data on the module object](https://github.com/inventaire/isbn3#groups)
* recover common hyphenization mistake `979-1091146135`
