import type { Post } from '../../shared/types'
import { posts } from '../../app/utils/mock-data'

const DEFAULT_PAGE_SIZE = 6

export default defineEventHandler((event) => {
  const q = getQuery(event)
  const tab = (q.tab as string) || 'recommend'
  const page = Math.max(Number(q.page) || 1, 1)
  const pageSize = Math.max(Number(q.pageSize) || DEFAULT_PAGE_SIZE, 1)

  let list = [...posts]
  switch (tab) {
    case 'hot': list.sort((a, b) => b.likeCount - a.likeCount); break
    case 'latest': list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break
    case 'follow': list = list.filter((p) => ['game', 'dev', 'photo'].includes(p.forumSlug)); break
    default: list.sort((a, b) => (b.badges.includes('essence') ? 1 : 0) - (a.badges.includes('essence') ? 1 : 0) || b.viewCount - a.viewCount)
  }

  return {
    list: list.slice((page - 1) * pageSize, page * pageSize),
    total: list.length,
    hasMore: page * pageSize < list.length,
  } satisfies { list: Post[]; total: number; hasMore: boolean }
})
