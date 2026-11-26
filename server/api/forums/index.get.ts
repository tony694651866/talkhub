import type { Forum } from '../../../shared/types'
import { forums } from '../../../app/utils/mock-data'

export default defineEventHandler((event): Forum[] => {
  const q = getQuery(event)
  const category = q.category as string | undefined
  const sort = q.sort as 'hot' | 'active' | 'new' | 'member' | undefined
  const keyword = q.keyword as string | undefined

  let list = [...forums]
  if (category && category !== '全部') list = list.filter((f) => f.category === category)
  if (keyword) list = list.filter((f) => (f.name + f.description + f.tags.join()).includes(keyword))
  switch (sort) {
    case 'new': list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
    case 'member': list.sort((a, b) => b.memberCount - a.memberCount); break
    case 'active': list.sort((a, b) => b.todayPosts - a.todayPosts); break
    default: list.sort((a, b) => b.memberCount * 0.3 + b.todayPosts * 10 - (a.memberCount * 0.3 + a.todayPosts * 10))
  }
  return list
})
