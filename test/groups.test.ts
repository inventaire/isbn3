import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { groups } from '../src/index.ts'

describe('groups', () => {
  it('should be the groups data object', () => {
    assert.equal(groups['978-99972'].name, 'Faroe Islands')
    assert.ok(Array.isArray(groups['978-99972'].ranges))
  })
})
