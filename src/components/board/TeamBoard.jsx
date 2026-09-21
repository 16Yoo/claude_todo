import { WORK_ITEM_STATUS, TEAMS } from '../../types'
import { getParentWorkItem, sortWorkItems, getTeamStatus } from '../../utils/workItemUtils'
import WorkItemCard from '../WorkItemCard'

const STATUSES = [
  { key: WORK_ITEM_STATUS.TODO, label: '할 일', emoji: '📋' },
  { key: WORK_ITEM_STATUS.IN_PROGRESS, label: '진행 중', emoji: '⚙️' },
  { key: WORK_ITEM_STATUS.REVIEW, label: '검토', emoji: '👀' },
  { key: WORK_ITEM_STATUS.DONE, label: '완료', emoji: '✅' }
]

const STATUS_CONFIG = {
  [WORK_ITEM_STATUS.TODO]: { emoji: '📋', label: '할 일' },
  [WORK_ITEM_STATUS.IN_PROGRESS]: { emoji: '⚙️', label: '진행 중' },
  [WORK_ITEM_STATUS.REVIEW]: { emoji: '👀', label: '검토' },
  [WORK_ITEM_STATUS.DONE]: { emoji: '✅', label: '완료' },
  [WORK_ITEM_STATUS.BLOCKED]: { emoji: '⛔', label: '차단됨' }
}

export default function TeamBoard({
  workItems,
  teamId,
  teamName,
  onUpdateWorkItem,
  onDeleteWorkItem
}) {
  const teamItems = workItems.filter(item => item.team_id === teamId || item.teamId === teamId)

  const getItemsByStatus = (status) => {
    return sortWorkItems(
      teamItems.filter(item => item.status === status)
    )
  }

  const getCollaboratingTeams = (item) => {
    const parentId = item.parent_id || item.parentId
    if (!parentId) return []

    const parent = getParentWorkItem(workItems, parentId)
    if (!parent) return []

    // 실제로 하위 일감이 있는 팀들만 추출
    const participatingTeams = new Set(
      workItems
        .filter(wi => (wi.parent_id || wi.parentId) === parentId)
        .map(wi => wi.team_id || wi.teamId)
    )

    // 자신의 팀을 제외하고 실제 참여 팀만 표시
    return Array.from(participatingTeams)
      .filter(key => key && key !== teamId)
      .map(key => {
        const team = TEAMS[key]
        if (!team) return null
        const teamStatus = getTeamStatus(workItems, parent.id, key)
        return {
          teamId: key,
          emoji: team.emoji,
          name: team.name,
          statusEmoji: STATUS_CONFIG[teamStatus].emoji,
          statusLabel: STATUS_CONFIG[teamStatus].label
        }
      })
      .filter(Boolean)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'
  }

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = ''
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = ''

    try {
      const itemData = JSON.parse(e.dataTransfer.getData('workItem'))
      if (itemData.status !== status) {
        onUpdateWorkItem(itemData.id, { status })
      }
    } catch (error) {
      console.error('Drop error:', error)
    }
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800">{TEAMS[teamId]?.emoji} {teamName}</h2>
        <p className="text-sm text-gray-600 mt-1">총 {teamItems.length}개 업무</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUSES.map(status => (
          <div
            key={status.key}
            className="bg-gray-100 rounded-lg p-4 min-h-96"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status.key)}
          >
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">{status.emoji}</span>
              {status.label}
              <span className="text-sm bg-gray-300 text-gray-700 px-2 py-1 rounded-full ml-auto">
                {getItemsByStatus(status.key).length}
              </span>
            </h3>

            <div className="space-y-3">
              {getItemsByStatus(status.key).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">업무 없음</p>
                </div>
              ) : (
                getItemsByStatus(status.key).map(item => (
                  <WorkItemCard
                    key={item.id}
                    item={item}
                    parentItem={item.parent_id || item.parentId ? getParentWorkItem(workItems, item.parent_id || item.parentId) : null}
                    onUpdate={onUpdateWorkItem}
                    onDelete={onDeleteWorkItem}
                    showParent={true}
                    collaboratingTeams={getCollaboratingTeams(item)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
