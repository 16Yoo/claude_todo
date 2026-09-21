import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import AddTaskModal from './AddTaskModal'

const TEAMS = {
  planning: { name: '기획팀', color: 'bg-blue-100 border-blue-300', emoji: '📋' },
  design: { name: '디자인팀', color: 'bg-purple-100 border-purple-300', emoji: '🎨' },
  dev: { name: '개발팀', color: 'bg-green-100 border-green-300', emoji: '💻' },
  overview: { name: '총괄팀', color: 'bg-pink-100 border-pink-300', emoji: '👑' }
}

const STATUS = {
  todo: { name: '할 일', color: 'bg-gray-100', emoji: '📋' },
  inProgress: { name: '진행 중', color: 'bg-yellow-100', emoji: '⚙️' },
  done: { name: '완료', color: 'bg-green-100', emoji: '✅' }
}

export default function KanbanBoard({
  user,
  onLogout,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) {
  const [showModal, setShowModal] = useState(false)

  const getVisibleTasks = () => {
    if (user.role === 'overview') {
      return tasks
    }
    return tasks.filter(task => task.team === user.role)
  }

  const visibleTasks = getVisibleTasks()

  const getTasksByStatus = (status) => {
    return visibleTasks.filter(task => task.status === status)
  }

  const visibleTeams = user.role === 'overview'
    ? Object.entries(TEAMS)
    : [[user.role, TEAMS[user.role]]]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {TEAMS[user.role].emoji} {user.teamName} 칸반 보드
            </h1>
            {user.role !== 'overview' && (
              <p className="text-sm text-gray-500 mt-1">자신의 팀 업무만 표시됩니다</p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg font-semibold transition"
        >
          + 새 업무 추가
        </button>

        {/* Team Sections */}
        {visibleTeams.map(([teamKey, teamData]) => (
          <div key={teamKey} className="mb-8">
            <div className={`p-4 rounded-lg border-2 ${teamData.color} mb-4`}>
              <h2 className="text-xl font-bold text-gray-800">
                {teamData.emoji} {teamData.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                총 {visibleTasks.filter(t => t.team === teamKey).length}개 업무
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(STATUS).map(([statusKey, statusData]) => (
                <KanbanColumn
                  key={statusKey}
                  statusKey={statusKey}
                  statusName={statusData.name}
                  statusEmoji={statusData.emoji}
                  statusColor={statusData.color}
                  tasks={visibleTasks.filter(
                    task => task.status === statusKey && task.team === teamKey
                  )}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  teamName={teamData.name}
                />
              ))}
            </div>
          </div>
        ))}

        {visibleTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">업무가 없습니다 😊</p>
          </div>
        )}
      </div>

      {showModal && (
        <AddTaskModal
          userRole={user.role}
          onAdd={(taskData) => {
            onAddTask(taskData)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
