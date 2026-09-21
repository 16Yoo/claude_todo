import TaskCard from './TaskCard'

export default function KanbanColumn({
  statusKey,
  statusName,
  statusEmoji,
  statusColor,
  tasks,
  onUpdateTask,
  onDeleteTask,
  teamName
}) {
  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'
  }

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = ''

    const taskData = JSON.parse(e.dataTransfer.getData('task'))
    if (taskData.status !== statusKey) {
      onUpdateTask(taskData.id, { status: statusKey })
    }
  }

  return (
    <div
      className={`${statusColor} rounded-lg p-4 min-h-96`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">{statusEmoji}</span>
        {statusName}
        <span className="text-sm bg-gray-300 text-gray-700 px-2 py-1 rounded-full ml-auto">
          {tasks.length}
        </span>
      </h3>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">업무 없음</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
