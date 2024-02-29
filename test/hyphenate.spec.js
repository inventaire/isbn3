import should from 'should'
import { hyphenate } from '../isbn.js'

describe('hyphenate', () => {
  it('hyphenates ISBN10s', () => {
    hyphenate('4873113369').should.equal('4-87311-336-9')
  })

  it('hyphenates ISBN10s with checksum X', () => {
    hyphenate('030433376X').should.equal('0-304-33376-X')
  })

  it('hyphenates ISBN13s', () => {
    hyphenate('9784873113364').should.equal('978-4-87311-336-4')
    hyphenate('9791091146135').should.equal('979-10-91146-13-5')
  })

  it('hyphenates ISBN13s with spaces', () => {
    hyphenate('978 4873113364').should.equal('978-4-87311-336-4')
    hyphenate('979 1091146135').should.equal('979-10-91146-13-5')
  })

  it('does not refuse hyphenated ISBNs', () => {
    hyphenate('4-87311-336-9').should.equal('4-87311-336-9')
    hyphenate('978-4-87311-336-4').should.equal('978-4-87311-336-4')
  })

  it('returns null for non-valid ISBN', () => {
    should(hyphenate('4873113360')).not.be.ok()
    should(hyphenate('9784873113360')).not.be.ok()
  })
})
