import { useState } from 'react'
import { TEAMS } from '../types'

const TEAM_CREDENTIALS = {
  planning: { password: 'planning123', role: 'TEAM_LEADER' },
  design: { password: 'design123', role: 'TEAM_LEADER' },
  dev: { password: 'dev123', role: 'TEAM_LEADER' },
  overview: { password: 'overview123', role: 'ADMIN' }
}

export default function Login({ onLogin }) {
  const [selectedTeam, setSelectedTeam] = useState('planning')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    const creds = TEAM_CREDENTIALS[selectedTeam]

    if (password === creds.password) {
      onLogin({
        id: `${selectedTeam}-user-${Date.now()}`,
        role: selectedTeam,
        teamName: TEAMS[selectedTeam].name,
        emoji: TEAMS[selectedTeam].emoji,
        userRole: creds.role
      })
      setError('')
    } else {
      setError('비밀번호가 틀렸습니다')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">📊 협업 칸반</h1>
        <p className="text-center text-gray-600 mb-8 text-sm">Team-Based Work Management System</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">팀 선택</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TEAMS).map(([key, team]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTeam(key)}
                  className={`p-4 rounded-lg font-semibold transition ${
                    selectedTeam === key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{team.emoji}</div>
                  <div className="text-sm">{team.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 비밀번호: {TEAM_CREDENTIALS[selectedTeam].password}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-2">📝 테스트 계정:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>📋 기획팀: planning123</li>
              <li>🎨 디자인팀: design123</li>
              <li>💻 개발팀: dev123</li>
              <li>👑 총괄팀: overview123</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-semibold mb-2">✨ 샘플 데이터:</p>
            <p className="text-xs text-green-600">
              로그인하면 샘플 상위 일감이 자동으로 생성됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
