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
    const clue = { message: 'Possible prefix error', candidate: { isbn13h: '979-10-90648-52-4', isbn13: '9791090648524', groupname: 'France' } }
    audit('978-1-0906-4852-5').clues[0].should.deepEqual(clue)
    audit('9781090648525').clues[0].should.deepEqual(clue)
    audit('978-1090648525').clues[0].should.deepEqual(clue)
  })

  it('should find 978-prefixed ISBN-13 that could be 979-prefixed ISBN-13 with altered checksum', () => {
    const clue = { message: 'Possible prefix error', candidate: { isbn13h: '978-1-0906-4852-5', isbn13: '9781090648525', isbn10h: '1-0906-4852-9', isbn10: '1090648529', groupname: 'English language' } }
    audit('979-10-90648-52-4').clues[0].should.deepEqual(clue)
    audit('9791090648524').clues[0].should.deepEqual(clue)
    audit('979-1090648524').clues[0].should.deepEqual(clue)
  })

  it('should find invalid 978-prefixed ISBN-13 that could be valid 979-prefixed ISBN-13', () => {
    const clue = { message: 'Checksum hints different prefix', candidate: { isbn13h: '979-10-90648-52-4', isbn13: '9791090648524', groupname: 'France' } }
    audit('978-1-0906-4852-4').clues[1].should.deepEqual(clue)
    audit('9781090648524').clues[1].should.deepEqual(clue)
    audit('978-1090648524').clues[1].should.deepEqual(clue)
  })

  it('should find invalid 979-prefixed ISBN-13 that could be valid 978-prefixed ISBN-13', () => {
    const clue = { message: 'Checksum hints different prefix', candidate: { isbn13h: '978-1-0906-4852-5', isbn13: '9781090648525', isbn10h: '1-0906-4852-9', isbn10: '1090648529', groupname: 'English language' } }
    audit('979-10-906-4852-5').clues[1].should.deepEqual(clue)
    audit('9791090648525').clues[1].should.deepEqual(clue)
    audit('979-1090648525').clues[1].should.deepEqual(clue)
  })

  it('should find truncated 978-prefixed ISBN-13 presented as ISBN-10', () => {
    const clue = { message: 'Checksum hints that it is an ISBN-13 without its 978 prefix', candidate: { isbn13h: '978-3-641-11542-5', isbn13: '9783641115425', isbn10h: '3-641-11542-6', isbn10: '3641115426', groupname: 'German language' } }
    audit('3-641-11542-5').clues[1].should.deepEqual(clue)
  })

  it('should find truncated 979-prefixed ISBN-13 presented as ISBN-10', () => {
    const clue = { message: 'Checksum hints that it is an ISBN-13 without its 979 prefix', candidate: { isbn13h: '979-10-210-5271-0', isbn13: '9791021052710', groupname: 'France' } }
    audit('10-210-5271-0').clues[1].should.deepEqual(clue)
  })

  it('should find unproperly 978-prefixed ISBN-10 presented as ISBN-13', () => {
    const clue = { message: 'Checksum hints that a 978 was added to an ISBN-10 without updating the checksum', candidate: { isbn10: '3641115426', isbn10h: '3-641-11542-6', isbn13: '9783641115425', isbn13h: '978-3-641-11542-5', groupname: 'German language'  } }
    audit('978-3-641-11542-6').clues[1].should.deepEqual(clue)
  })

  it('should suggest a valid checksum', () => {
    const clue = { message: "Found a matching group and publisher range, but the checksum didn't match. Could the checksum be wrong?", candidate: { isbn13h: '978-1-78168-213-5', isbn13: '9781781682135', isbn10h: '1-78168-213-5', isbn10: '1781682135', groupname: 'English language' } }
    audit('9781781682134').clues[0].should.deepEqual(clue)
  })

  it('should report when no group was found', () => {
    audit('979-989-000000-0').clues[0].should.deepEqual({ message: 'Could not find a matching ISBN group' })
  })

  it('should report when a group was found but no matching range', () => {
    const clue = { message: 'Found a matching group but no matching publisher range', group:{ prefix: '979-8', name: 'United States' } }
    audit('979-8-00-000000-0').clues[0].should.deepEqual(clue)
  })
})
