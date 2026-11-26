import type { Notification } from '../../shared/types'
import { notifications } from '../../app/utils/mock-data'

export default defineEventHandler((): Notification[] => notifications)
