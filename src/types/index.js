// WorkItem 상태
export const WORK_ITEM_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED'
}

// 우선순위
export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
}

// 팀
export const TEAMS = {
  planning: { id: 'planning', name: '기획팀', emoji: '📋', color: 'bg-blue-100 border-blue-300' },
  design: { id: 'design', name: '디자인팀', emoji: '🎨', color: 'bg-purple-100 border-purple-300' },
  dev: { id: 'dev', name: '개발팀', emoji: '💻', color: 'bg-green-100 border-green-300' }
}

// 사용자 역할
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PM',
  TEAM_LEADER: 'TEAM_LEADER',
  MEMBER: 'MEMBER'
}

/**
 * WorkItem 인터페이스
 * @typedef {Object} WorkItem
 * @property {string} id - 고유 ID
 * @property {string} title - 제목
 * @property {string} [description] - 설명
 * @property {string} [parentId] - 상위 일감 ID (null이면 상위 일감)
 * @property {string} [teamId] - 담당 팀 ID
 * @property {string} [assigneeId] - 담당자 ID
 * @property {string} status - 상태 (TODO, IN_PROGRESS, REVIEW, DONE, BLOCKED)
 * @property {string} priority - 우선순위 (LOW, MEDIUM, HIGH)
 * @property {string} [dueDate] - 마감일
 * @property {boolean} required - 필수 여부
 * @property {number} order - 정렬 순서
 * @property {string} createdAt - 생성일
 * @property {string} updatedAt - 수정일
 */

export const createWorkItem = (data) => ({
  id: data.id || Date.now().toString(),
  title: data.title,
  description: data.description || '',
  parentId: data.parentId || null,
  teamId: data.teamId || null,
  assigneeId: data.assigneeId || null,
  status: data.status || WORK_ITEM_STATUS.TODO,
  priority: data.priority || PRIORITY.MEDIUM,
  dueDate: data.dueDate || null,
  required: data.required !== false,
  order: data.order || 0,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString()
})
