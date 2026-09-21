import { TEAMS, WORK_ITEM_STATUS } from '../types'
import { calculateProgress, getTeamStatus } from '../utils/workItemUtils'

const STATUS_CONFIG = {
  [WORK_ITEM_STATUS.TODO]: { emoji: '📋', label: '할 일' },
  [WORK_ITEM_STATUS.IN_PROGRESS]: { emoji: '⚙️', label: '진행 중' },
  [WORK_ITEM_STATUS.REVIEW]: { emoji: '👀', label: '검토' },
  [WORK_ITEM_STATUS.DONE]: { emoji: '✅', label: '완료' },
  [WORK_ITEM_STATUS.BLOCKED]: { emoji: '⛔', label: '차단됨' }
}

export default function WorkItemDetail({
  workItem,
  childItems,
  allWorkItems,
  onUpdate,
  onDelete,
  onClose
}) {
  const progress = calculateProgress(allWorkItems, workItem.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{workItem.title}</h2>
            {workItem.description && (
              <p className="text-gray-600 mt-2">{workItem.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 진행률 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">전체 진행률</h3>
            <span className="text-2xl font-bold text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 팀별 상태 */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4">팀별 진행 상황</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TEAMS).map(([teamKey, team]) => {
              const status = getTeamStatus(allWorkItems, workItem.id, teamKey)
              const statusConfig = STATUS_CONFIG[status]
              const teamChildren = childItems.filter(item => item.teamId === teamKey)

              return (
                <div key={teamKey} className="p-4 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{team.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{team.name}</h4>
                      <p className="text-xs text-gray-500">{teamChildren.length}개 업무</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">{statusConfig.emoji}</span>
                    <span className="font-semibold text-gray-700">{statusConfig.label}</span>
                  </div>

                  {teamChildren.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                      {teamChildren.map(child => (
                        <div key={child.id} className="text-xs text-gray-600">
                          <span className="font-medium">•</span> {child.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 font-semibold">우선순위</p>
            <p className="text-sm font-bold text-gray-800 mt-1">
              {workItem.priority === 'HIGH' ? '🔴' : workItem.priority === 'MEDIUM' ? '🟡' : '🔵'} {workItem.priority}
            </p>
          </div>
          {workItem.dueDate && (
            <div>
              <p className="text-xs text-gray-500 font-semibold">마감일</p>
              <p className="text-sm font-bold text-gray-800 mt-1">📅 {workItem.dueDate}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 font-semibold">생성일</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{new Date(workItem.createdAt).toLocaleDateString('ko-KR')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold">수정일</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{new Date(workItem.updatedAt).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onDelete(workItem.id)
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
