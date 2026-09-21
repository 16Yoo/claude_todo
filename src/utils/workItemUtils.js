import { WORK_ITEM_STATUS } from '../types'

export const getChildWorkItems = (workItems, parentId) => {
  return workItems.filter(item => item.parentId === parentId)
}

export const getParentWorkItem = (workItems, parentId) => {
  return workItems.find(item => item.id === parentId)
}

export const calculateProgress = (workItems, parentId) => {
  const children = getChildWorkItems(workItems, parentId)
  if (children.length === 0) return 0

  const completed = children.filter(item => item.status === WORK_ITEM_STATUS.DONE).length
  return Math.round((completed / children.length) * 100)
}

export const calculateParentStatus = (workItems, parentId) => {
  const children = getChildWorkItems(workItems, parentId)
  if (children.length === 0) return WORK_ITEM_STATUS.TODO

  const statuses = children.map(item => item.status)
  const hasBlocked = statuses.includes(WORK_ITEM_STATUS.BLOCKED)
  const allDone = statuses.every(status => status === WORK_ITEM_STATUS.DONE)
  const anyInProgress = statuses.some(status => status === WORK_ITEM_STATUS.IN_PROGRESS || status === WORK_ITEM_STATUS.REVIEW)

  if (hasBlocked) return WORK_ITEM_STATUS.BLOCKED
  if (allDone) return WORK_ITEM_STATUS.DONE
  if (anyInProgress) return WORK_ITEM_STATUS.IN_PROGRESS
  return WORK_ITEM_STATUS.TODO
}

export const getTeamItemsForParent = (workItems, parentId) => {
  const children = getChildWorkItems(workItems, parentId)
  const teamItems = {}

  children.forEach(item => {
    if (!teamItems[item.teamId]) {
      teamItems[item.teamId] = []
    }
    teamItems[item.teamId].push(item)
  })

  return teamItems
}

export const getTeamProgress = (workItems, parentId, teamId) => {
  const children = getChildWorkItems(workItems, parentId)
  const teamItems = children.filter(item => item.teamId === teamId)

  if (teamItems.length === 0) return 0

  const completed = teamItems.filter(item => item.status === WORK_ITEM_STATUS.DONE).length
  return Math.round((completed / teamItems.length) * 100)
}

export const getTeamStatus = (workItems, parentId, teamId) => {
  const children = getChildWorkItems(workItems, parentId)
  const teamItems = children.filter(item => item.teamId === teamId)

  if (teamItems.length === 0) return WORK_ITEM_STATUS.TODO

  const statuses = teamItems.map(item => item.status)
  const hasBlocked = statuses.includes(WORK_ITEM_STATUS.BLOCKED)
  const allDone = statuses.every(status => status === WORK_ITEM_STATUS.DONE)
  const anyInProgress = statuses.some(status => status === WORK_ITEM_STATUS.IN_PROGRESS || status === WORK_ITEM_STATUS.REVIEW)

  if (hasBlocked) return WORK_ITEM_STATUS.BLOCKED
  if (allDone) return WORK_ITEM_STATUS.DONE
  if (anyInProgress) return WORK_ITEM_STATUS.IN_PROGRESS
  return WORK_ITEM_STATUS.TODO
}

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

export const getDueStatus = (dueDate) => {
  const days = getDaysUntilDue(dueDate)
  if (days === null) return { status: 'none', style: '', message: '' }

  if (days < 0) return { status: 'overdue', style: 'text-red-600 font-semibold', message: `⚠️ ${Math.abs(days)}일 초과` }
  if (days === 0) return { status: 'today', style: 'text-orange-600 font-semibold', message: '📌 오늘' }
  if (days === 1) return { status: 'tomorrow', style: 'text-yellow-600 font-semibold', message: '📌 내일' }
  if (days <= 3) return { status: 'soon', style: 'text-yellow-600', message: `📌 ${days}일` }
  return { status: 'normal', style: 'text-gray-500', message: `📅 ${dueDate}` }
}

export const sortWorkItems = (items) => {
  return [...items].sort((a, b) => {
    const statusPriority = { [WORK_ITEM_STATUS.BLOCKED]: 0, [WORK_ITEM_STATUS.TODO]: 1, [WORK_ITEM_STATUS.IN_PROGRESS]: 2, [WORK_ITEM_STATUS.REVIEW]: 3, [WORK_ITEM_STATUS.DONE]: 4 }
    const priorityValue = { HIGH: 0, MEDIUM: 1, LOW: 2 }

    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status]
    }

    if (priorityValue[a.priority] !== priorityValue[b.priority]) {
      return priorityValue[a.priority] - priorityValue[b.priority]
    }

    return a.order - b.order
  })
}
