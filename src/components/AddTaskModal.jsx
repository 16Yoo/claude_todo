import { useState } from 'react'

const TEAMS = {
  planning: '기획팀',
  design: '디자인팀',
  dev: '개발팀'
}

export default function AddTaskModal({ userRole, onAdd, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: userRole !== 'overview' ? userRole : 'planning',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    dueDate: ''
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('업무 제목을 입력해주세요')
      return
    }

    onAdd(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">새 업무 추가</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">업무 제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="업무 제목을 입력하세요"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="업무 설명 (선택사항)"
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* 팀 */}
          {userRole === 'overview' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">팀 선택 *</label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="planning">📋 기획팀</option>
                <option value="design">🎨 디자인팀</option>
                <option value="dev">💻 개발팀</option>
              </select>
            </div>
          )}

          {userRole !== 'overview' && (
            <input type="hidden" name="team" value={formData.team} />
          )}

          {/* 중요도 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">중요도</label>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map(level => (
                <label key={level} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={level}
                    checked={formData.priority === level}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    {level === 'high' ? '높음 🔴' : level === 'medium' ? '중간 🟡' : '낮음 🔵'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 담당자 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">담당자</label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="담당자 이름 (선택사항)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* 마감일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">마감일</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* 버튼 */}
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
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
