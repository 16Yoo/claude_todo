export default function TodoItem({ todo, onToggle, onDelete }) {
  const priorityConfig = {
    high: { color: 'bg-red-100 border-red-300', indicator: '🔴', label: '높음' },
    medium: { color: 'bg-yellow-100 border-yellow-300', indicator: '🟡', label: '중간' },
    low: { color: 'bg-blue-100 border-blue-300', indicator: '🔵', label: '낮음' }
  }

  const getDueStatus = () => {
    if (!todo.dueDate) return { status: 'none', style: '', message: '' }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDateTime = new Date(todo.dueDate)
    const diffTime = dueDateTime - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: 'overdue', style: 'bg-red-200 border-red-400', message: `⚠️ ${Math.abs(diffDays)}일 초과` }
    if (diffDays === 0) return { status: 'today', style: 'bg-orange-200 border-orange-400', message: '📌 오늘' }
    if (diffDays === 1) return { status: 'tomorrow', style: 'bg-yellow-200 border-yellow-400', message: '📌 내일' }
    if (diffDays <= 3) return { status: 'soon', style: 'bg-yellow-100 border-yellow-300', message: `📌 ${diffDays}일 남음` }
    return { status: 'normal', style: '', message: `📅 ${todo.dueDate}` }
  }

  const config = priorityConfig[todo.priority] || priorityConfig.medium
  const dueStatus = getDueStatus()

  const getBorderStyle = () => {
    if (todo.completed) return 'border-gray-300 bg-gray-100'
    if (dueStatus.status === 'overdue') return 'border-red-400 bg-red-50'
    if (dueStatus.status === 'today') return 'border-orange-400 bg-orange-50'
    if (dueStatus.status === 'tomorrow') return 'border-yellow-400 bg-yellow-50'
    if (dueStatus.status === 'soon') return 'border-yellow-300 bg-yellow-50'
    return `${config.color}`
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg transition border-l-4 hover:shadow-md ${getBorderStyle()}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span
          className={`block text-lg transition ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-800'
          }`}
        >
          {todo.text}
        </span>
        <div className="flex gap-2 flex-wrap mt-2 text-xs text-gray-600">
          <span>중요도: {config.indicator} {config.label}</span>
          {todo.dueDate && <span className={dueStatus.status !== 'none' ? 'font-semibold' : ''}>{dueStatus.message}</span>}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium whitespace-nowrap"
      >
        삭제
      </button>
    </div>
  )
}
