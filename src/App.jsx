import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { workItemsApi, setupRealtimeListeners } from './services/api'

function App() {
  const [user, setUser] = useState(null)
  const [workItems, setWorkItems] = useState([])
  const [currentBoard, setCurrentBoard] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadWorkItems()
      setupRealtime()
    }
  }, [user])

  const loadWorkItems = async () => {
    try {
      setLoading(true)
      const data = await workItemsApi.getAll()
      setWorkItems(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load work items:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtime = () => {
    const subscription = setupRealtimeListeners.workItems((payload) => {
      if (payload.eventType === 'INSERT') {
        setWorkItems(prev => [...prev, payload.new])
      } else if (payload.eventType === 'UPDATE') {
        setWorkItems(prev =>
          prev.map(item => item.id === payload.new.id ? payload.new : item)
        )
      } else if (payload.eventType === 'DELETE') {
        setWorkItems(prev =>
          prev.filter(item => item.id !== payload.old.id && item.parent_id !== payload.old.id)
        )
      }
    })

    return () => {
      setupRealtimeListeners.unsubscribe(subscription)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentBoard('overview')
    setWorkItems([])
  }

  const addWorkItem = async (item) => {
    try {
      const newItem = {
        ...item,
        id: `item-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      await workItemsApi.create(newItem)
    } catch (err) {
      console.error('Failed to add work item:', err)
      setError(err.message)
    }
  }

  const updateWorkItem = async (id, updates) => {
    try {
      await workItemsApi.update(id, updates)
    } catch (err) {
      console.error('Failed to update work item:', err)
      setError(err.message)
    }
  }

  const deleteWorkItem = async (id) => {
    try {
      await workItemsApi.deleteChildren(id)
      await workItemsApi.delete(id)
    } catch (err) {
      console.error('Failed to delete work item:', err)
      setError(err.message)
    }
  }

  const createSubItems = async (parentId, teamIds) => {
    try {
      const parent = workItems.find(item => item.id === parentId)
      if (!parent) return

      for (let i = 0; i < teamIds.length; i++) {
        const teamId = teamIds[i]
        const newItem = {
          id: `${parentId}-${i + 1}`,
          title: `${parent.title} - ${teamId} 담당`,
          parent_id: parentId,
          team_id: teamId,
          status: 'TODO',
          priority: parent.priority,
          due_date: parent.due_date || '',
          required: true,
          order: i,
          description: parent.description || '',
          assignee_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        await workItemsApi.create(newItem)
      }
    } catch (err) {
      console.error('Failed to create sub items:', err)
      setError(err.message)
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {error}
        </div>
      )}
      <Dashboard
        user={user}
        onLogout={handleLogout}
        workItems={workItems}
        onAddWorkItem={addWorkItem}
        onUpdateWorkItem={updateWorkItem}
        onDeleteWorkItem={deleteWorkItem}
        onCreateSubItems={createSubItems}
        currentBoard={currentBoard}
        onBoardChange={setCurrentBoard}
        loading={loading}
        onRefresh={loadWorkItems}
      />
    </>
  )
}

export default App
