import type { SearchResult } from '../../shared/types'
import { forums, posts, topics, users } from '../../app/utils/mock-data'

export default defineEventHandler((event): SearchResult => {
  const keyword = ((getQuery(event).q as string) || '').trim()
  if (!keyword) return { posts: [], forums: [], users: [], topics: [] }
  return {
    posts: posts.filter((p) => (p.title + p.excerpt + p.tags.join()).includes(keyword)),
    forums: forums.filter((f) => (f.name + f.description + f.category).includes(keyword)),
    users: users.filter((u) => (u.nickname + u.bio + u.username).includes(keyword)),
    topics: topics.filter((t) => t.name.includes(keyword)),
  }
})
