// get_group.ts — Locate the registration group for an ISBN-13

import groups from './groups.js'
import type { Group } from './types.js'

interface FoundGroup {
  groupId: string
  groupPrefix: string
  groupData: Group
}

interface GroupMatch {
  group: string
  groupPrefix: string
  ranges: Group['ranges']
  restAfterGroup: string
}

const findGroup = (prefix: string, restAfterPrefix: string, maxGroupIdLength: number): FoundGroup | undefined => {
  let length = 0
  while (length <= maxGroupIdLength) {
    const groupId = restAfterPrefix.slice(0, length)
    const groupPrefix = `${prefix}-${groupId}`
    const groupData = groups[groupPrefix]
    if (groupData) return { groupId, groupPrefix, groupData }
    length++
  }
  return undefined
}

export default (isbn13: string): GroupMatch | null => {
  const prefix = isbn13.substring(0, 3)
  const restAfterPrefix = isbn13.substring(3)
  const foundGroup = findGroup(prefix, restAfterPrefix, 5)
  if (!foundGroup) return null
  return {
    group: foundGroup.groupId,
    groupPrefix: foundGroup.groupPrefix,
    ranges: foundGroup.groupData.ranges,
    restAfterGroup: restAfterPrefix.slice(foundGroup.groupId.length),
  }
}
