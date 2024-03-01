#!/usr/bin/env bash
mkdir -p ./dist
esbuild ./isbn.js --bundle --minify --outfile=dist/isbn.mjs
esbuild ./isbn.js --bundle  --minify --platform=node --outfile=dist/isbn.cjs