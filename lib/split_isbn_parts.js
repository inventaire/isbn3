const getGroup = require('./get_group')

module.exports = isbn => {
  if (isbn.length === 10) isbn = '978' + isbn
  if (isbn.length === 13) return findValidCodes(isbn)
  return null
}

const findValidCodes = isbn13 => {
  const groupData = getGroup(isbn13)

  if (!groupData) return null

  const { group, ranges, restAfterGroup } = groupData

  for (let range of ranges) {
    const [ min, max ] = range
    const publisher = restAfterGroup.substr(0, min.length)
    // Warning: comparing strings: seems to be ok as ranges boundaries are of the same length
    // and we are testing a publisher code of that same length
    // (so there won't be cases of the kind '2' > '199' === true)
    if (min <= publisher && max >= publisher) {
      const restAfterPublisher = restAfterGroup.substr(publisher.length)
      const check = restAfterPublisher.slice(-1)
      return {
        group,
        publisher,
        article: restAfterPublisher.slice(0, -1),
        check: check === 'x' ? 'X' : check
      }
    }
  }

  return null
}
