import should from 'should'
import { asIsbn13 } from '../isbn.js'

describe('asIsbn13', () => {
  it('converts ISBN10 to ISBN13', () => {
    asIsbn13('4-87311-336-9').should.equal('9784873113364')
  })

  it('accepts ISBN10 with checksum X', () => {
    asIsbn13('0-304-33376-X').should.equal('9780304333769')
  })

  it('accepts ISBN13', () => {
    asIsbn13('978-4-87311-336-4').should.equal('9784873113364')
  })

  it('hyphenates result', () => {
    asIsbn13('4-87311-336-9', true).should.equal('978-4-87311-336-4')
  })

  it('returns null if ISBN is invalid', () => {
    should(asIsbn13('4873113361')).not.be.ok()
  })
})
