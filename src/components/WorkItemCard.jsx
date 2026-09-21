import { TEAMS, PRIORITY } from '../types'
import { getDueStatus } from '../utils/workItemUtils'

const PRIORITY_CONFIG = {
  HIGH: { emoji: '🔴', label: '높음' },
  MEDIUM: { emoji: '🟡', label: '중간' },
  LOW: { emoji: '🔵', label: '낮음' }
}

export default function WorkItemCard({
  item,
  parentItem,
  onUpdate,
  onDelete,
  showParent = false
}) {
  const priorityConfig = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.MEDIUM
  const teamInfo = TEAMS[item.teamId]
  const dueStatus = getDueStatus(item.dueDate)

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('workItem', JSON.stringify(item))
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:shadow-md cursor-move transition hover:border-purple-400"
    >
      {showParent && parentItem && (
        <div className="mb-3 pb-3 border-b border-gray-200">
          <p className="text-xs text-gray-500 font-semibold">상위: {parentItem.title}</p>
        </div>
      )}

      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-semibold text-gray-800 flex-1 break-words text-sm">
          {item.title}
        </h4>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-400 hover:text-red-500 transition flex-shrink-0 text-lg"
        >
          ✕
        </button>
      </div>

      {item.description && (
        <p className="text-xs text-gray-600 mb-2 break-words">{item.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-300 font-medium">
            {priorityConfig.emoji} {priorityConfig.label}
          </span>
          {teamInfo && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-300 font-medium">
              {teamInfo.emoji} {teamInfo.name}
            </span>
          )}
        </div>

        {item.assigneeId && (
          <div className="text-xs text-gray-600">
            👤 {item.assigneeId}
          </div>
        )}

        {item.dueDate && (
          <div className={`text-xs ${dueStatus.style}`}>
            {dueStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}
