# CHANGELOG
*versions follow [SemVer](http://semver.org)*

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
