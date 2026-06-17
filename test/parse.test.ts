import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parse } from '../src/index.js'

describe('parse', () => {
  it('returns an object with all the data when valid', () => {
    assert.ok(parse('9791091146135'))
    assert.ok(parse('979-1091146135'))
    assert.ok(parse('979 1091146135'))
  })

  it('returns null for invalid ISBNs', () => {
    assert.equal(parse(''), null)
    assert.equal(parse('0-00-000-0'), null)
    assert.equal(parse('0-00000-0000-0'), null)
    assert.equal(parse('00000000000000000'), null)
    assert.equal(parse('9788184890261'), null)
    assert.equal(parse('4036526651248'), null)
  })

  it('should return consistent hyphenatization', () => {
    const a = parse('978-88-3282-181-9')
    const b = parse('978-88-328-2181-9')
    assert.ok(a)
    assert.ok(b)
    assert.equal(a.isbn13h, b.isbn13h)
    assert.equal(a.isbn10h, b.isbn10h)
  })

  describe('given an ISBN10', () => {
    it('detects ISBN standard', () => {
      const data = parse('0-7356-1967-0')
      assert.ok(data)
      assert.equal(data.isIsbn10, true)
      assert.equal(data.isIsbn13, false)
    })

    it('includes source', () => {
      assert.equal(parse('0-7356-1967-0')?.source, '0-7356-1967-0')
    })

    it('does not include prefix', () => {
      assert.ok(!parse('0-7356-1967-0')?.prefix)
    })

    it('includes group id', () => {
      assert.equal(parse('0-7356-1967-0')?.group, '0')
    })

    it('includes group name', () => {
      assert.equal(parse('0-7356-1967-0')?.groupname, 'English language')
    })

    it('includes publisher id', () => {
      assert.equal(parse('0-7356-1967-0')?.publisher, '7356')
    })

    it('includes article id', () => {
      assert.equal(parse('0-7356-1967-0')?.article, '1967')
    })

    it('includes check digits for ISBN10/13', () => {
      const data = parse('0-7356-1967-0')
      assert.equal(data?.check10, '0')
      assert.equal(data?.check13, '8')
    })

    it('includes plain and hyphenated versions of ISBN10/13', () => {
      const data = parse('0-7356-1967-0')
      assert.equal(data?.isbn10, '0735619670')
      assert.equal(data?.isbn10h, '0-7356-1967-0')
      assert.equal(data?.isbn13, '9780735619678')
      assert.equal(data?.isbn13h, '978-0-7356-1967-8')
    })
  })

  describe('given an ISBN10 with checksum X', () => {
    it('detects ISBN standard', () => {
      const data = parse('0-304-33376-X')
      assert.ok(data)
      assert.equal(data.isIsbn10, true)
      assert.equal(data.isIsbn13, false)
    })

    it('includes source', () => {
      assert.equal(parse('0-304-33376-X')?.source, '0-304-33376-X')
    })

    it('does not include prefix', () => {
      assert.ok(!parse('0-304-33376-X')?.prefix)
    })

    it('includes group id', () => {
      assert.equal(parse('0-304-33376-X')?.group, '0')
    })

    it('includes group name', () => {
      assert.equal(parse('0-304-33376-X')?.groupname, 'English language')
    })

    it('includes publisher id', () => {
      assert.equal(parse('0-304-33376-X')?.publisher, '304')
    })

    it('includes article id', () => {
      assert.equal(parse('0-304-33376-X')?.article, '33376')
    })

    it('includes check digits for ISBN10/13', () => {
      const data = parse('0-304-33376-X')
      assert.equal(data?.check10, 'X')
      assert.equal(data?.check13, '9')
    })

    it('includes plain and hyphenated versions of ISBN10/13', () => {
      const data = parse('0-304-33376-X')
      assert.equal(data?.isbn10, '030433376X')
      assert.equal(data?.isbn10h, '0-304-33376-X')
      assert.equal(data?.isbn13, '9780304333769')
      assert.equal(data?.isbn13h, '978-0-304-33376-9')
    })

    it('normalizes lowercase x to uppercase X in check digit', () => {
      const data = parse('85-359-0624-x')
      assert.equal(data?.check, 'X')
      assert.equal(data?.check10, 'X')
      assert.equal(data?.isbn10h, '85-359-0624-X')
      assert.equal(data?.isbn10, '853590624X')
      assert.equal(data?.isValid, true)
    })
  })

  describe('given an ISBN13', () => {
    describe('with prefix 978', () => {
      it('detects ISBN standard', () => {
        const data = parse('978-3-642-38745-6')
        assert.equal(data?.isIsbn10, false)
        assert.equal(data?.isIsbn13, true)
      })

      it('includes source', () => {
        assert.equal(parse('978-3-642-38745-6')?.source, '978-3-642-38745-6')
      })

      it('includes prefix', () => {
        assert.equal(parse('978-3-642-38745-6')?.prefix, '978')
      })

      it('includes group id', () => {
        assert.equal(parse('978-3-642-38745-6')?.group, '3')
      })

      it('includes group name', () => {
        assert.equal(parse('978-3-642-38745-6')?.groupname, 'German language')
      })

      it('includes publisher id', () => {
        assert.equal(parse('978-3-642-38745-6')?.publisher, '642')
      })

      it('includes article id', () => {
        assert.equal(parse('978-3-642-38745-6')?.article, '38745')
      })

      it('includes check digits for ISBN10/13', () => {
        const data = parse('978-3-642-38745-6')
        assert.equal(data?.check10, '4')
        assert.equal(data?.check13, '6')
      })

      it('includes plain and hyphenated versions of ISBN10/13', () => {
        const data = parse('978-3-642-38745-6')
        assert.equal(data?.isbn10, '3642387454')
        assert.equal(data?.isbn10h, '3-642-38745-4')
        assert.equal(data?.isbn13, '9783642387456')
        assert.equal(data?.isbn13h, '978-3-642-38745-6')
      })
    })

    describe('with prefix 979', () => {
      it('includes prefix', () => {
        assert.equal(parse('9791091146135')?.prefix, '979')
      })

      it('does not include isbn10h, check10', () => {
        assert.equal(parse('9791091146135')?.isbn10h, undefined)
        // TODO logic calculates check10 even for 979
        // assert.equal(parse('9791091146135')?.check10, undefined)
      })

      it('includes group id', () => {
        assert.equal(parse('9791091146135')?.group, '10')
      })

      it('includes group name', () => {
        assert.equal(parse('9791091146135')?.groupname, 'France')
      })
    })
  })
})
