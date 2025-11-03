const should = require('should')
const { parse } = require('../isbn')

describe('parse', () => {
  it('returns an object with all the data when valid', () => {
    parse('9791091146135').should.be.ok()
    parse('979-1091146135').should.be.ok()
    parse('979 1091146135').should.be.ok()
  })

  it('returns null for invalid ISBNs', () => {
    should(parse('')).not.be.ok()
    should(parse('0-00-000-0')).not.be.ok()
    should(parse('0-00000-0000-0')).not.be.ok()
    should(parse('00000000000000000')).not.be.ok()
    should(parse('9788184890261')).not.be.ok()
    should(parse('4036526651248')).not.be.ok()
  })

  it('should return consistent hyphenatization', () => {
    const a = parse('978-88-3282-181-9')
    const b = parse('978-88-328-2181-9')
    a.isbn13h.should.equal(b.isbn13h)
    a.isbn10h.should.equal(b.isbn10h)
  })

  describe('given an ISBN10', () => {
    it('detects ISBN standard', () => {
      const { isIsbn10, isIsbn13 } = parse('0-7356-1967-0')
      isIsbn10.should.be.true()
      isIsbn13.should.be.false()
    })

    it('includes source', () => {
      parse('0-7356-1967-0').source.should.equal('0-7356-1967-0')
    })

    it('does not include prefix', () => {
      const { prefix } = parse('0-7356-1967-0')
      should(prefix).not.be.ok()
    })

    it('includes group id', () => {
      parse('0-7356-1967-0').group.should.equal('0')
    })

    it('includes group name', () => {
      parse('0-7356-1967-0').groupname.should.equal('English language')
    })

    it('includes publisher id', () => {
      parse('0-7356-1967-0').publisher.should.equal('7356')
    })

    it('includes article id', () => {
      parse('0-7356-1967-0').article.should.equal('1967')
    })

    it('includes check digits for ISBN10/13', () => {
      const { check10, check13 } = parse('0-7356-1967-0')
      check10.should.equal('0')
      check13.should.equal('8')
    })

    it('includes plain and hyphenated versions of ISBN10/13', () => {
      const { isbn10, isbn10h, isbn13, isbn13h } = parse('0-7356-1967-0')
      isbn10.should.equal('0735619670')
      isbn10h.should.equal('0-7356-1967-0')
      isbn13.should.equal('9780735619678')
      isbn13h.should.equal('978-0-7356-1967-8')
    })
  })

  describe('given an ISBN10 with checksum X', () => {
    it('detects ISBN standard', () => {
      const { isIsbn10, isIsbn13 } = parse('0-304-33376-X')
      isIsbn10.should.be.true()
      isIsbn13.should.be.false()
    })

    it('includes source', () => {
      parse('0-304-33376-X').source.should.equal('0-304-33376-X')
    })

    it('does not include prefix', () => {
      should(parse('0-304-33376-X').prefix).not.be.ok()
    })

    it('includes group id', () => {
      parse('0-304-33376-X').group.should.equal('0')
    })

    it('includes group name', () => {
      parse('0-304-33376-X').groupname.should.equal('English language')
    })

    it('includes publisher id', () => {
      parse('0-304-33376-X').publisher.should.equal('304')
    })

    it('includes article id', () => {
      parse('0-304-33376-X').article.should.equal('33376')
    })

    it('includes check digits for ISBN10/13', () => {
      const { check10, check13 } = parse('0-304-33376-X')
      check10.should.equal('X')
      check13.should.equal('9')
    })

    it('includes plain and hyphenated versions of ISBN10/13', () => {
      const { isbn10, isbn10h, isbn13, isbn13h } = parse('0-304-33376-X')
      isbn10.should.equal('030433376X')
      isbn10h.should.equal('0-304-33376-X')
      isbn13.should.equal('9780304333769')
      isbn13h.should.equal('978-0-304-33376-9')
    })

    it('normalizes lowercase x to uppercase X in check digit', () => {
      const { check, check10, isValid, isbn10, isbn10h } = parse('85-359-0624-x')
      check.should.equal('X')
      check10.should.equal('X')
      isbn10h.should.equal('85-359-0624-X')
      isbn10.should.equal('853590624X')
      isValid.should.be.true()
    })
  })

  describe('given an ISBN13', () => {
    describe('with prefix 978', () => {
      it('detects ISBN standard', () => {
        const { isIsbn10, isIsbn13 } = parse('978-3-642-38745-6')
        isIsbn10.should.be.false()
        isIsbn13.should.be.true()
      })

      it('includes source', () => {
        parse('978-3-642-38745-6').source.should.equal('978-3-642-38745-6')
      })

      it('includes prefix', () => {
        parse('978-3-642-38745-6').prefix.should.equal('978')
      })

      it('includes group id', () => {
        parse('978-3-642-38745-6').group.should.equal('3')
      })

      it('includes group name', () => {
        parse('978-3-642-38745-6').groupname.should.equal('German language')
      })

      it('includes publisher id', () => {
        parse('978-3-642-38745-6').publisher.should.equal('642')
      })

      it('includes article id', () => {
        parse('978-3-642-38745-6').article.should.equal('38745')
      })

      it('includes check digits for ISBN10/13', () => {
        const { check10, check13 } = parse('978-3-642-38745-6')
        check10.should.equal('4')
        check13.should.equal('6')
      })

      it('includes plain and hyphenated versions of ISBN10/13', () => {
        const { isbn10, isbn10h, isbn13, isbn13h } = parse('978-3-642-38745-6')
        isbn10.should.equal('3642387454')
        isbn10h.should.equal('3-642-38745-4')
        isbn13.should.equal('9783642387456')
        isbn13h.should.equal('978-3-642-38745-6')
      })
    })

    describe('with prefix 979', () => {
      it('includes prefix', () => {
        parse('9791091146135').prefix.should.equal('979')
      })

      it('includes group id', () => {
        parse('9791091146135').group.should.equal('10')
      })

      it('includes group name', () => {
        parse('9791091146135').groupname.should.equal('France')
      })
    })
  })
})
