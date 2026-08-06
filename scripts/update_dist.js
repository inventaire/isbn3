#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const babelify = require('babelify')
const UglifyJS = require('uglify-js')

const projectRoot = path.resolve(__dirname, '..')
const entryFile = path.join(projectRoot, 'isbn.js')
const distDir = path.join(projectRoot, 'dist')
const distFile = path.join(distDir, 'isbn.js')
const minifiedFile = path.join(distDir, 'isbn.min.js')

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir)

browserify(entryFile, { standalone: 'ISBN' })
  .transform(babelify.configure({ presets: [ 'es2015' ] }))
  .bundle((error, bundledCode) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    const code = bundledCode.toString()
    fs.writeFileSync(distFile, code)

    const minified = UglifyJS.minify(code)
    if (minified.error) {
      console.error(minified.error)
      process.exit(1)
    }

    fs.writeFileSync(minifiedFile, minified.code)
    console.log('Updated dist bundle')
  })