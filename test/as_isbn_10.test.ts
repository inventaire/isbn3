import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { asIsbn10 } from '../src/index.js'

describe('asIsbn10', () => {
  it('converts ISBN13 to ISBN10', () => {
    assert.equal(asIsbn10('978-4-87311-336-4'), '4873113369')
  })

  it('accepts ISBN10', () => {
    assert.equal(asIsbn10('4-87311-336-9'), '4873113369')
  })

  it('accepts ISBN10 with checksum X', () => {
    assert.equal(asIsbn10('0-304-33376-X'), '030433376X')
  })

  it('hyphenates result', () => {
    assert.equal(asIsbn10('978-4-87311-336-4', true), '4-87311-336-9')
  })

  it('returns null if ISBN is invalid', () => {
    assert.ok(!asIsbn10('9790000000000'))
  })

  describe('with prefix 979', () => {
    it('does not try to "map" it to ISBN10', () => {
      assert.ok(!asIsbn10('9791091146135'))
    })
  })
})
