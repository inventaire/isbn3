import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hyphenate } from '../src/index.ts'

describe('hyphenate', () => {
  it('hyphenates ISBN10s', () => {
    assert.equal(hyphenate('4873113369'), '4-87311-336-9')
  })

  it('hyphenates ISBN10s with checksum X', () => {
    assert.equal(hyphenate('030433376X'), '0-304-33376-X')
  })

  it('hyphenates ISBN13s', () => {
    assert.equal(hyphenate('9784873113364'), '978-4-87311-336-4')
    assert.equal(hyphenate('9791091146135'), '979-10-91146-13-5')
  })

  it('hyphenates ISBN13s with spaces', () => {
    assert.equal(hyphenate('978 4873113364'), '978-4-87311-336-4')
    assert.equal(hyphenate('979 1091146135'), '979-10-91146-13-5')
  })

  it('does not refuse hyphenated ISBNs', () => {
    assert.equal(hyphenate('4-87311-336-9'), '4-87311-336-9')
    assert.equal(hyphenate('978-4-87311-336-4'), '978-4-87311-336-4')
  })

  it('returns null for non-valid ISBN', () => {
    assert.ok(!hyphenate('4873113360'))
    assert.ok(!hyphenate('9784873113360'))
  })
})
