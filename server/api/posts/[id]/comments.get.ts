import type { Comment } from '../../../../shared/types'
import { comments } from '../../../../app/utils/mock-data'

export default defineEventHandler((event): Comment[] => {
  const id = getRouterParam(event, 'id')
  const sort = (getQuery(event).sort as 'hot' | 'latest') || 'hot'
  // Mock 评论只有部分帖子有独立数据，其余回落到 p1（与原服务层行为一致）
  const list = [...(comments[id ?? ''] ?? comments.p1 ?? [])]
  if (sort === 'hot') list.sort((a, b) => b.likeCount - a.likeCount)
  return list
})
