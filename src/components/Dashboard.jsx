import { useState } from 'react'
import { TEAMS } from '../types'
import MainBoard from './board/MainBoard'
import TeamBoard from './board/TeamBoard'
import MyBoard from './board/MyBoard'

export default function Dashboard({
  user,
  onLogout,
  workItems,
  onAddWorkItem,
  onUpdateWorkItem,
  onDeleteWorkItem,
  onCreateSubItems,
  currentBoard,
  onBoardChange,
  loading,
  onRefresh
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setIsRefreshing(false)
    }
  }

  const getBoards = () => {
    const baseBoards = [
      { id: 'overview', label: '통합 보드', icon: '📊' }
    ]

    if (user.role === 'overview') {
      // 총괄팀: 모든 팀 보드 + 내 업무
      return [
        ...baseBoards,
        { id: 'planning', label: '📋 기획팀', icon: '📋' },
        { id: 'design', label: '🎨 디자인팀', icon: '🎨' },
        { id: 'dev', label: '💻 개발팀', icon: '💻' },
        { id: 'my', label: '👤 내 업무', icon: '👤' }
      ]
    } else {
      // 팀원: 자신의 팀 + 내 업무
      return [
        ...baseBoards,
        { id: user.role, label: `${TEAMS[user.role].emoji} ${TEAMS[user.role].name}`, icon: TEAMS[user.role].emoji },
        { id: 'my', label: '👤 내 업무', icon: '👤' }
      ]
    }
  }

  const boards = getBoards()

  const renderBoard = () => {
    switch (currentBoard) {
      case 'overview':
        return (
          <MainBoard
            workItems={workItems}
            onUpdateWorkItem={onUpdateWorkItem}
            onDeleteWorkItem={onDeleteWorkItem}
            onAddWorkItem={onAddWorkItem}
            onCreateSubItems={onCreateSubItems}
          />
        )
      case 'my':
        return (
          <MyBoard
            workItems={workItems}
            user={user}
            onUpdateWorkItem={onUpdateWorkItem}
            onDeleteWorkItem={onDeleteWorkItem}
          />
        )
      case 'planning':
      case 'design':
      case 'dev':
        return (
          <TeamBoard
            workItems={workItems}
            teamId={currentBoard}
            teamName={TEAMS[currentBoard].name}
            onUpdateWorkItem={onUpdateWorkItem}
            onDeleteWorkItem={onDeleteWorkItem}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              📊 협업 칸반 보드
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {TEAMS[user.role]?.emoji} {TEAMS[user.role]?.name}
              </span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50"
                title="데이터 새로고침"
              >
                {isRefreshing ? '새로고침중...' : '🔄'}
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* Board Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {boards.map(board => (
              <button
                key={board.id}
                onClick={() => onBoardChange(board.id)}
                className={`px-4 py-2 rounded-lg font-medium transition flex-shrink-0 ${
                  currentBoard === board.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {board.icon} {board.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {currentBoard === 'overview' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg font-semibold transition"
          >
            + 새 상위 일감
          </button>
        )}

        {renderBoard()}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateWorkItemModal
          onClose={() => setShowCreateModal(false)}
          onAdd={(item) => {
            onAddWorkItem(item)
            setShowCreateModal(false)
          }}
          onCreateSubItems={onCreateSubItems}
        />
      )}
    </div>
  )
}

function CreateWorkItemModal({ onClose, onAdd, onCreateSubItems }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    due_date: '',
    teams: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTeamToggle = (teamId) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams.filter(t => t !== teamId)
        : [...prev.teams, teamId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요')
      return
    }

    const workItem = {
      title: formData.title,
      description: formData.description,
      parent_id: null,
      status: 'TODO',
      priority: formData.priority,
      due_date: formData.due_date,
      required: true
    }

    onAdd(workItem)

    if (formData.teams.length > 0) {
      setTimeout(() => {
        onCreateSubItems(workItem.id, formData.teams)
      }, 100)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">새 상위 일감 만들기</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 회원가입 기능 출시"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="상세 설명 (선택사항)"
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">우선순위</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="LOW">🔵 낮음</option>
              <option value="MEDIUM">🟡 중간</option>
              <option value="HIGH">🔴 높음</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">마감일</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">참여 팀</label>
            <div className="space-y-2">
              {Object.entries(TEAMS).map(([key, team]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={formData.teams.includes(key)}
                    onChange={() => handleTeamToggle(key)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{team.emoji} {team.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition font-medium"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
