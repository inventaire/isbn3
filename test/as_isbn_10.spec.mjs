import { asIsbn10 } from '../isbn.js'
import should from 'should'

describe('asIsbn10', () => {
  it('converts ISBN13 to ISBN10', () => {
    asIsbn10('978-4-87311-336-4').should.equal('4873113369')
  })

  it('accepts ISBN10', () => {
    asIsbn10('4-87311-336-9').should.equal('4873113369')
  })

  it('accepts ISBN10 with checksum X', () => {
    asIsbn10('0-304-33376-X').should.equal('030433376X')
  })

  it('hyphenates result', () => {
    asIsbn10('978-4-87311-336-4', true).should.equal('4-87311-336-9')
  })

  it('returns null if ISBN is invalid', () => {
    should(asIsbn10('9790000000000')).not.be.ok()
  })

  describe('with prefix 979', () => {
    it('does not try to "map" it to ISBN10', () => {
      should(asIsbn10('9791091146135')).not.be.ok()
    })
  })
})
