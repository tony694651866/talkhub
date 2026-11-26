import { users } from '../../../../app/utils/mock-data'

export default defineEventHandler((event) => {
  const username = getRouterParam(event, 'username')
  const user = users.find((u) => u.username === username)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User Not Found' })
  }
  return user
})
