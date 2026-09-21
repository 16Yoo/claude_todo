import { useState } from 'react'
import { getChildWorkItems, calculateProgress, getTeamStatus } from '../../utils/workItemUtils'
import { TEAMS, WORK_ITEM_STATUS } from '../../types'
import WorkItemDetail from '../WorkItemDetail'

export default function MainBoard({
  workItems,
  onUpdateWorkItem,
  onDeleteWorkItem,
  onAddWorkItem,
  onCreateSubItems
}) {
  const [selectedItem, setSelectedItem] = useState(null)

  const parentItems = workItems.filter(item => !item.parentId)

  const getStatusEmoji = (status) => {
    const emojis = {
      [WORK_ITEM_STATUS.TODO]: '📋',
      [WORK_ITEM_STATUS.IN_PROGRESS]: '⚙️',
      [WORK_ITEM_STATUS.REVIEW]: '👀',
      [WORK_ITEM_STATUS.DONE]: '✅',
      [WORK_ITEM_STATUS.BLOCKED]: '⛔'
    }
    return emojis[status] || '❓'
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">상위 일감이 없습니다</p>
          </div>
        ) : (
          parentItems.map(item => {
            const children = getChildWorkItems(workItems, item.id)
            const progress = calculateProgress(workItems, item.id)
            const childrenByTeam = {}

            children.forEach(child => {
              if (!childrenByTeam[child.teamId]) {
                childrenByTeam[child.teamId] = []
              }
              childrenByTeam[child.teamId].push(child)
            })

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-purple-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-800 flex-1 break-words">
                    {item.title}
                  </h3>
                  <span className="text-2xl flex-shrink-0">{getStatusEmoji(item.status)}</span>
                </div>

                {(item.description || item.description) && (
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                )}

                {/* 진행률 */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">진행률</span>
                    <span className="text-sm font-bold text-purple-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* 팀별 상태 */}
                <div className="space-y-2 mb-4">
                  {Object.entries(TEAMS).map(([teamKey, team]) => {
                    const status = getTeamStatus(workItems, item.id, teamKey)
                    const statusEmoji = getStatusEmoji(status)
                    const count = childrenByTeam[teamKey]?.length || 0

                    return (
                      <div
                        key={teamKey}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {team.emoji} {team.name}
                        </span>
                        <span className="text-sm">{statusEmoji} {count > 0 && `(${count})`}</span>
                      </div>
                    )
                  })}
                </div>

                {/* 마감일 */}
                {item.dueDate && (
                  <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                    📅 {item.dueDate}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <WorkItemDetail
          workItem={selectedItem}
          childItems={getChildWorkItems(workItems, selectedItem.id)}
          allWorkItems={workItems}
          onUpdate={onUpdateWorkItem}
          onDelete={onDeleteWorkItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}
