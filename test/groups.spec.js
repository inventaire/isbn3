import should from 'should'
import { groups } from '../isbn.js'

describe('groups', () => {
  it('should be the groups data object', () => {
    groups['978-99972'].name.should.equal('Faroe Islands')
    groups['978-99972'].ranges.should.be.an.Array()
  })
})
