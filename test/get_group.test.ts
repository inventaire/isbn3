import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import getGroup from '../src/get_group.js'

describe('getGroup', () => {
  it('should find an ISBN group when existing', () => {
    const found = getGroup('9781781682134')
    assert.ok(found)
    assert.equal(found.group, '1')
    assert.equal(found.restAfterGroup, '781682134')
    assert.ok(Array.isArray(found.ranges))
  })

  it('should return null when no group exists', () => {
    assert.ok(!getGroup('9799991682134'))
  })
})
