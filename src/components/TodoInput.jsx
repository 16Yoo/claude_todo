import { useState } from 'react'

export default function TodoInput({ onAddTodo }) {
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) {
      alert('할일을 입력해주세요!')
      return
    }
    onAddTodo(text, priority, dueDate)
    setInput('')
    setPriority('medium')
    setDueDate('')
  }

  const priorityStyles = {
    high: 'text-red-600 bg-red-50 border-red-300',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-300',
    low: 'text-blue-600 bg-blue-50 border-blue-300'
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="새로운 할일을 입력하세요..."
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition whitespace-nowrap"
        >
          추가
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 py-2">중요도:</span>
        {['low', 'medium', 'high'].map((level) => (
          <label key={level} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="priority"
              value={level}
              checked={priority === level}
              onChange={(e) => setPriority(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className={`text-sm px-3 py-1 rounded-full border-2 font-medium ${priorityStyles[level]}`}>
              {level === 'high' ? '높음 🔴' : level === 'medium' ? '중간 🟡' : '낮음 🔵'}
            </span>
          </label>
        ))}
      </div>
    </form>
  )
}
