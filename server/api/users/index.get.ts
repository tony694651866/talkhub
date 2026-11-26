import type { User } from '../../../shared/types'
import { users } from '../../../app/utils/mock-data'

export default defineEventHandler((): User[] => users)
