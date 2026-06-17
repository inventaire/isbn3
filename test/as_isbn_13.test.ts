import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { asIsbn13 } from '../src/index.js'

describe('asIsbn13', () => {
  it('converts ISBN10 to ISBN13', () => {
    assert.equal(asIsbn13('4-87311-336-9'), '9784873113364')
  })

  it('accepts ISBN10 with checksum X', () => {
    assert.equal(asIsbn13('0-304-33376-X'), '9780304333769')
  })

  it('accepts ISBN13', () => {
    assert.equal(asIsbn13('978-4-87311-336-4'), '9784873113364')
  })

  it('hyphenates result', () => {
    assert.equal(asIsbn13('4-87311-336-9', true), '978-4-87311-336-4')
  })

  it('returns null if ISBN is invalid', () => {
    assert.ok(!asIsbn13('4873113361'))
  })
})
