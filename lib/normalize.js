// normalize.js — Strip non-digit/non-X characters from an ISBN string
// Extracted from audit.js to follow single-responsibility principle

module.exports = input => input.replace(/[^\dX]/g, '')
