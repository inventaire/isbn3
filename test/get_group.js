require('should')
const getGroup = require('../lib/get_group')

describe('getGroup', () => {
  it('should be find an ISBN group when existing', () => {
    const { group, ranges, restAfterGroup } = getGroup('9781781682134')
    group.should.equal('1')
    restAfterGroup.should.equal('781682134')
    ranges.should.be.an.Array()
  })

  it('should returning null when no group exists', () => {
    should(getGroup('9799991682134')).not.be.ok()
  })
})
