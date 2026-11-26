import { currentUser } from '../../../app/utils/mock-data'

// 当前登录用户（Mock 会话）
export default defineEventHandler(() => currentUser)
