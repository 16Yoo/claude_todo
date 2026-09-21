import { WORK_ITEM_STATUS } from '../../types'
import { sortWorkItems } from '../../utils/workItemUtils'
import WorkItemCard from '../WorkItemCard'

const STATUSES = [
  { key: WORK_ITEM_STATUS.TODO, label: '할 일', emoji: '📋' },
  { key: WORK_ITEM_STATUS.IN_PROGRESS, label: '진행 중', emoji: '⚙️' },
  { key: WORK_ITEM_STATUS.REVIEW, label: '검토', emoji: '👀' },
  { key: WORK_ITEM_STATUS.DONE, label: '완료', emoji: '✅' }
]

export default function MyBoard({
  workItems,
  user,
  onUpdateWorkItem,
  onDeleteWorkItem
}) {
  const myItems = workItems.filter(item => item.assigneeId === user.id)

  const getItemsByStatus = (status) => {
    return sortWorkItems(
      myItems.filter(item => item.status === status)
    )
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'
  }

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = ''
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    e.currentTarget.style.backgroundColor = ''

    try {
      const itemData = JSON.parse(e.dataTransfer.getData('workItem'))
      if (itemData.status !== status) {
        onUpdateWorkItem(itemData.id, { status })
      }
    } catch (error) {
      console.error('Drop error:', error)
    }
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800">👤 내 업무</h2>
        <p className="text-sm text-gray-600 mt-1">총 {myItems.length}개 업무</p>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">할당된 업무가 없습니다 😊</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map(status => (
            <div
              key={status.key}
              className="bg-gray-100 rounded-lg p-4 min-h-96"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.key)}
            >
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">{status.emoji}</span>
                {status.label}
                <span className="text-sm bg-gray-300 text-gray-700 px-2 py-1 rounded-full ml-auto">
                  {getItemsByStatus(status.key).length}
                </span>
              </h3>

              <div className="space-y-3">
                {getItemsByStatus(status.key).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">업무 없음</p>
                  </div>
                ) : (
                  getItemsByStatus(status.key).map(item => (
                    <WorkItemCard
                      key={item.id}
                      item={item}
                      onUpdate={onUpdateWorkItem}
                      onDelete={onDeleteWorkItem}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
