import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggleTodo, onDeleteTodo }) {
  const priorityOrder = { high: 0, medium: 1, low: 2 }

  const sortedTodos = [...todos].sort((a, b) => {
    const aCompleted = a.completed ? 1 : 0
    const bCompleted = b.completed ? 1 : 0

    if (aCompleted !== bCompleted) return aCompleted - bCompleted

    const getDueUrgency = (todo) => {
      if (!todo.dueDate) return 999
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(todo.dueDate)
      const diffTime = dueDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays < 0 ? -1000 - Math.abs(diffDays) : diffDays
    }

    const aUrgency = getDueUrgency(a)
    const bUrgency = getDueUrgency(b)

    if (aUrgency !== bUrgency) return aUrgency - bUrgency

    const aPriority = priorityOrder[a.priority] ?? 1
    const bPriority = priorityOrder[b.priority] ?? 1
    return aPriority - bPriority
  })

  return (
    <div className="space-y-2">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </div>
  )
}
