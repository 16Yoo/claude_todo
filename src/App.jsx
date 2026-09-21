import { useState, useEffect } from 'react'
import Login from './components/Login'
import KanbanBoard from './components/KanbanBoard'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      setTasks(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }])
  }

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <KanbanBoard
      user={user}
      onLogout={handleLogout}
      tasks={tasks}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
    />
  )
}

export default App
