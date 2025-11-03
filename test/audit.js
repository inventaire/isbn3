const should = require('should')
const { audit } = require('../isbn')

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
      { message: 'Possible prefix error', candidate: '979-10-90648-52-4', isbn13: '9791090648524', groupname: 'France' }
    ]
    audit('978-1-0906-4852-5').clues.should.deepEqual(clues)
    audit('9781090648525').clues.should.deepEqual(clues)
    audit('978-1090648525').clues.should.deepEqual(clues)
  })

  it('should find 978-prefixed ISBN-13 that could be 979-prefixed ISBN-13 with altered checksum', () => {
    const clues = [
      { message: 'Possible prefix error', candidate: '978-1-0906-4852-5', isbn13: '9781090648525', groupname: 'English language' }
    ]
    audit('979-10-90648-52-4').clues.should.deepEqual(clues)
    audit('9791090648524').clues.should.deepEqual(clues)
    audit('979-1090648524').clues.should.deepEqual(clues)
  })

  it('should find invalid 978-prefixed ISBN-13 that could be valid 979-prefixed ISBN-13', () => {
    const clues = [
      { message: 'Checksum hints different prefix', candidate: '979-10-90648-52-4', isbn13: '9791090648524', groupname: 'France' }
    ]
    audit('978-1-0906-4852-4').clues.should.deepEqual(clues)
    audit('9781090648524').clues.should.deepEqual(clues)
    audit('978-1090648524').clues.should.deepEqual(clues)
  })

  it('should find invalid 979-prefixed ISBN-13 that could be valid 978-prefixed ISBN-13', () => {
    const clues = [
      { message: 'Checksum hints different prefix', candidate: '978-1-0906-4852-5', isbn13: '9781090648525', groupname: 'English language' }
    ]
    audit('979-10-906-4852-5').clues.should.deepEqual(clues)
    audit('9791090648525').clues.should.deepEqual(clues)
    audit('979-1090648525').clues.should.deepEqual(clues)
  })

  it('should find truncated 978-prefixed ISBN-13 presented as ISBN-10', () => {
    const clues = [
      { message: 'Checksum hints that it is an ISBN-13 without its 978 prefix', candidate: '978-3-641-11542-5', isbn13: '9783641115425', groupname: 'German language' }
    ]
    audit('3-641-11542-5').clues.should.deepEqual(clues)
  })

  it('should find truncated 979-prefixed ISBN-13 presented as ISBN-10', () => {
    const clues = [
      { message: 'Checksum hints that it is an ISBN-13 without its 979 prefix', candidate: '979-10-210-5271-0', isbn13: '9791021052710', groupname: 'France' }
    ]
    audit('10-210-5271-0').clues.should.deepEqual(clues)
  })

  it('should find unproperly 978-prefixed ISBN-10 presented as ISBN-13', () => {
    const clues = [
      { message: 'Checksum hints that a 978 was added to an ISBN-10 without updating the checksum', candidate: '3-641-11542-6', isbn13: '9783641115425', groupname: 'German language' }
    ]
    audit('978-3-641-11542-6').clues.should.deepEqual(clues)
  })

  it('should suggest a valid checksum', () => {
    const clues = [
      { message: 'No alternative prefix or form could be found. Maybe the problem is the invalid checksum?', candidate: '978-1-78168-213-5', isbn13: '9781781682135', groupname: 'English language' }
    ]
    audit('9781781682134').clues.should.deepEqual(clues)
  })
})
