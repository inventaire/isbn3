// split_isbn_parts.ts — Split an ISBN body into group/publisher/article/check

import getGroup from './get_group.ts'
import type { IsbnParts } from './types.ts'

const findValidCodes = (isbn13: string): IsbnParts | null => {
  const groupData = getGroup(isbn13)
  if (!groupData) return null

  const { group, ranges, restAfterGroup } = groupData

  for (const [min, max] of ranges) {
    const publisher = restAfterGroup.slice(0, min.length)
    // Warning: comparing strings: seems to be ok as ranges boundaries are of the same length
    // and we are testing a publisher code of that same length
    // (so there won't be cases of the kind '2' > '199' === true)
    if (min <= publisher && max >= publisher) {
      const restAfterPublisher = restAfterGroup.slice(publisher.length)
      const check = restAfterPublisher.slice(-1)
      return {
        group,
        publisher,
        article: restAfterPublisher.slice(0, -1),
        check: check === 'x' ? 'X' : check,
      }
    }
  }

  return null
}

export default (isbn: string): IsbnParts | null => {
  const isbn13 = isbn.length === 10 ? `978${isbn}` : isbn
  return isbn13.length === 13 ? findValidCodes(isbn13) : null
}
