import type { Forum, Post, Topic, User } from '../../shared/types'
import { forums, posts, topics, users } from '../../app/utils/mock-data'

export type RankingItem = Post | Forum | User | Topic

export default defineEventHandler((event): RankingItem[] => {
  const q = getQuery(event)
  const range = (q.range as 'today' | 'week' | 'month') || 'week'
  const tab = (q.tab as 'posts' | 'forums' | 'authors' | 'topics') || 'posts'
  const factor = { today: 0.35, week: 0.7, month: 1 }[range]

  if (tab === 'posts') return [...posts].sort((a, b) => b.likeCount * factor - a.likeCount * factor).slice(0, 10)
  if (tab === 'forums') return [...forums].sort((a, b) => b.todayPosts * factor * 30 + b.memberCount * 0.1 - (a.todayPosts * factor * 30 + a.memberCount * 0.1)).slice(0, 8)
  if (tab === 'authors') return [...users].filter((u) => u.id !== 'u8').sort((a, b) => b.followers * factor - a.followers * factor).slice(0, 8)
  return [...topics].sort((a, b) => b.heat * factor - a.heat * factor).slice(0, 8)
})
