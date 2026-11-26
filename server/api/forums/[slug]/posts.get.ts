import type { Post } from '../../../../shared/types'
import { forums, posts } from '../../../../app/utils/mock-data'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!forums.some((f) => f.slug === slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Forum Not Found' })
  }

  const q = getQuery(event)
  const tab = (q.tab as string) || 'all'
  // page/pageSize 可选：不传则返回全部（保持原「吧页一次取全量」的行为）
  const page = Math.max(Number(q.page) || 1, 1)
  const pageSize = Number(q.pageSize) || 0

  let list = posts.filter((p) => p.forumSlug === slug)
  switch (tab) {
    case 'latest': list = [...list].reverse(); break
    case 'hot': list = [...list].sort((a, b) => b.likeCount - a.likeCount); break
    case 'essence': list = list.filter((p) => p.badges.includes('essence')); break
    case 'image': list = list.filter((p) => p.type === 'image'); break
    case 'vote': list = list.filter((p) => p.type === 'vote'); break
  }

  const sliced = pageSize > 0 ? list.slice((page - 1) * pageSize, page * pageSize) : list
  return {
    list: sliced,
    total: list.length,
    hasMore: pageSize > 0 ? page * pageSize < list.length : false,
  } satisfies { list: Post[]; total: number; hasMore: boolean }
})
