import should from 'should'
import { audit } from '../isbn.js'

describe('audit', () => {
  it('should return audit data', () => {
    audit('9782070375165').should.deepEqual({
      source: '9782070375165',
      validIsbn: true,
      groupname: 'French language',
      clues: []
    })
  })

  it('should find 978-prefixed ISBN-13 that could be 979-prefixed ISBN-13 with altered checksum', () => {
    const clues = [
      {
        message: 'possible prefix error',
        candidate: '979-10-90648-52-4',
        isbn13: '9791090648524',
        groupname: 'France'
      }
    ]
    audit('978-1-0906-4852-5').clues.should.deepEqual(clues)
    audit('9781090648525').clues.should.deepEqual(clues)
    audit('978-1090648525').clues.should.deepEqual(clues)
  })

  it('should find 978-prefixed ISBN-13 that could be 979-prefixed ISBN-13 with altered checksum', () => {
    const clues = [
      {
        message: 'possible prefix error',
        candidate: '978-1-0906-4852-5',
        isbn13: '9781090648525',
        groupname: 'English language'
      }
    ]
    audit('979-10-90648-52-4').clues.should.deepEqual(clues)
    audit('9791090648524').clues.should.deepEqual(clues)
    audit('979-1090648524').clues.should.deepEqual(clues)
  })

  it('should find invalid 978-prefixed ISBN-13 that could be valid 979-prefixed ISBN-13', () => {
    const clues = [
      {
        message: 'checksum hints different prefix',
        candidate: '979-10-90648-52-4',
        isbn13: '9791090648524',
        groupname: 'France'
      }
    ]
    audit('978-1-0906-4852-4').clues.should.deepEqual(clues)
    audit('9781090648524').clues.should.deepEqual(clues)
    audit('978-1090648524').clues.should.deepEqual(clues)
  })

  it('should find invalid 979-prefixed ISBN-13 that could be valid 978-prefixed ISBN-13', () => {
    const clues = [
      {
        message: 'checksum hints different prefix',
        candidate: '978-1-0906-4852-5',
        isbn13: '9781090648525',
        groupname: 'English language'
      }
    ]
    audit('979-10-906-4852-5').clues.should.deepEqual(clues)
    audit('9791090648525').clues.should.deepEqual(clues)
    audit('979-1090648525').clues.should.deepEqual(clues)
  })
})
