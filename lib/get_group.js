const groups = require('./groups')

module.exports = isbn13 => {
  const prefix = isbn13.substring(0, 3)
  const restAfterPrefix = isbn13.substring(3)
  const foundGroup = findGroup(prefix, restAfterPrefix, 5)
  if (!foundGroup) return null
  return {
    group: foundGroup.groupId,
    ranges: foundGroup.groupData.ranges,
    restAfterGroup: restAfterPrefix.slice(foundGroup.groupId.length)
  }
}

function findGroup (prefix, restAfterPrefix, maxGroupIdLength) {
  let length = 0
  while (length <= maxGroupIdLength) {
    const groupId = restAfterPrefix.slice(0, length)
    const groupData = groups[`${prefix}-${groupId}`]
    if (groupData) return { groupId, groupData }
    else length++
  }
}
