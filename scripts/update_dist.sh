#!/usr/bin/env bash
mkdir -p ./dist
esbuild ./isbn.js --bundle --minify --outfile=dist/isbn.min.js