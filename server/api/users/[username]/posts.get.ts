import type { Post } from '../../../../shared/types'
import { posts } from '../../../../app/utils/mock-data'

export default defineEventHandler((event): Post[] => {
  const username = getRouterParam(event, 'username')
  return posts.filter((p) => p.author === username)
})
