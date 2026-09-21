const PRIORITY_CONFIG = {
  high: { color: 'bg-red-100 border-red-300', emoji: '🔴', label: '높음' },
  medium: { color: 'bg-yellow-100 border-yellow-300', emoji: '🟡', label: '중간' },
  low: { color: 'bg-blue-100 border-blue-300', emoji: '🔵', label: '낮음' }
}

const TEAM_CONFIG = {
  planning: { emoji: '📋', label: '기획팀' },
  design: { emoji: '🎨', label: '디자인팀' },
  dev: { emoji: '💻', label: '개발팀' }
}

export default function TaskCard({ task, onDelete }) {
  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const teamConfig = TEAM_CONFIG[task.team] || {}

  const getDueStatus = () => {
    if (!task.dueDate) return { style: '', message: '' }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { style: 'text-red-600 font-semibold', message: `⚠️ ${Math.abs(diffDays)}일 초과` }
    if (diffDays === 0) return { style: 'text-orange-600 font-semibold', message: '📌 오늘' }
    if (diffDays === 1) return { style: 'text-yellow-600 font-semibold', message: '📌 내일' }
    if (diffDays <= 3) return { style: 'text-yellow-600', message: `📌 ${diffDays}일` }
    return { style: 'text-gray-500', message: `📅 ${task.dueDate}` }
  }

  const dueStatus = getDueStatus()

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('task', JSON.stringify(task))}
      className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:shadow-md cursor-move transition hover:border-purple-400"
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-semibold text-gray-800 flex-1 break-words">{task.title}</h4>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 break-words">{task.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full border ${priorityConfig.color} font-medium`}>
            {priorityConfig.emoji} {priorityConfig.label}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-300 font-medium">
            {teamConfig.emoji} {teamConfig.label}
          </span>
        </div>

        {task.assignee && (
          <div className="text-xs text-gray-600">
            👤 {task.assignee}
          </div>
        )}

        {task.dueDate && (
          <div className={`text-xs ${dueStatus.style}`}>
            {dueStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}
