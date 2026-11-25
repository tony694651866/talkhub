// TalkHub Service 层：页面与组件只允许通过这里取数。
// Mock Provider 与真实 API 返回结构一致，后续切换后端只改本层实现。
import type {
  HomePayload, Post, Comment, Forum, User, Notification, Topic, SearchResult,
} from '~/../shared/types'
import * as DB from '~/utils/mock-data'

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms))


// ---------- 查询 ----------
export async function getHome(): Promise<HomePayload> {
  await delay()
  return {
    heroSlides: DB.heroSlides,
    categories: DB.categories,
    recommendedForums: DB.forums.slice(0, 5),
    hotPosts: [...DB.posts].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5),
    trendingTopics: DB.topics.slice(0, 8),
    activeUsers: DB.users.slice(0, 4),
    announcements: DB.announcements,
  }
}

export type PostTab = 'recommend' | 'follow' | 'hot' | 'latest'

export async function getPostFeed(tab: PostTab, page = 1, pageSize = 6) {
  await delay()
  let list = [...DB.posts]
  switch (tab) {
    case 'hot': list.sort((a, b) => b.likeCount - a.likeCount); break
    case 'latest': list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break
    case 'follow': list = list.filter((p) => ['game', 'dev', 'photo'].includes(p.forumSlug)); break
    default: list.sort((a, b) => (b.badges.includes('essence') ? 1 : 0) - (a.badges.includes('essence') ? 1 : 0) || b.viewCount - a.viewCount)
  }
  return { list: list.slice((page - 1) * pageSize, page * pageSize), total: list.length, hasMore: page * pageSize < list.length }
}

export async function getForumList(opts: { category?: string; sort?: 'hot' | 'active' | 'new' | 'member'; keyword?: string } = {}) {
  await delay()
  let list = [...DB.forums]
  if (opts.category && opts.category !== '全部') list = list.filter((f) => f.category === opts.category)
  if (opts.keyword) list = list.filter((f) => (f.name + f.description + f.tags.join()).includes(opts.keyword!))
  switch (opts.sort) {
    case 'new': list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
    case 'member': list.sort((a, b) => b.memberCount - a.memberCount); break
    case 'active': list.sort((a, b) => b.todayPosts - a.todayPosts); break
    default: list.sort((a, b) => b.memberCount * 0.3 + b.todayPosts * 10 - (a.memberCount * 0.3 + a.todayPosts * 10))
  }
  return list
}

export async function getForum(slug: string): Promise<Forum | undefined> {
  await delay()
  return DB.forums.find((f) => f.slug === slug)
}

export async function getForumPosts(slug: string, tab: string) {
  await delay()
  let list = DB.posts.filter((p) => p.forumSlug === slug)
  switch (tab) {
    case 'latest': list = [...list].reverse(); break
    case 'hot': list = [...list].sort((a, b) => b.likeCount - a.likeCount); break
    case 'essence': list = list.filter((p) => p.badges.includes('essence')); break
    case 'image': list = list.filter((p) => p.type === 'image'); break
    case 'vote': list = list.filter((p) => p.type === 'vote'); break
  }
  return list
}

export async function getPost(id: string): Promise<Post | undefined> {
  await delay()
  return DB.posts.find((p) => p.id === id)
}

export async function getPostComments(postId: string, sort: 'hot' | 'latest' = 'hot'): Promise<Comment[]> {
  await delay()
  const list = [...(DB.comments[postId] ?? DB.comments.p1 ?? [])]
  if (sort === 'hot') list.sort((a, b) => b.likeCount - a.likeCount)
  return list
}

export async function searchAll(keyword: string): Promise<SearchResult> {
  await delay(300)
  const kw = keyword.trim()
  if (!kw) return { posts: [], forums: [], users: [], topics: [] }
  return {
    posts: DB.posts.filter((p) => (p.title + p.excerpt + p.tags.join()).includes(kw)),
    forums: DB.forums.filter((f) => (f.name + f.description + f.category).includes(kw)),
    users: DB.users.filter((u) => (u.nickname + u.bio + u.username).includes(kw)),
    topics: DB.topics.filter((t) => t.name.includes(kw)),
  }
}

export async function getNotifications() {
  await delay()
  return DB.notifications
}

export async function getUser(username: string): Promise<User | undefined> {
  await delay()
  return DB.users.find((u) => u.username === username)
}

export async function getUserPosts(username: string) {
  await delay()
  return DB.posts.filter((p) => p.author === username)
}

export async function getRankings(range: 'today' | 'week' | 'month', tab: 'posts' | 'forums' | 'authors' | 'topics') {
  await delay()
  const factor = { today: 0.35, week: 0.7, month: 1 }[range]
  if (tab === 'posts') return [...DB.posts].sort((a, b) => (b.likeCount * factor) - (a.likeCount * factor)).slice(0, 10)
  if (tab === 'forums') return [...DB.forums].sort((a, b) => (b.todayPosts * factor * 30 + b.memberCount * 0.1) - (a.todayPosts * factor * 30 + a.memberCount * 0.1)).slice(0, 8)
  if (tab === 'authors') return [...DB.users].filter((u) => u.id !== 'u8').sort((a, b) => (b.followers * factor) - (a.followers * factor)).slice(0, 8)
  return [...DB.topics].sort((a, b) => (b.heat * factor) - (a.heat * factor)).slice(0, 8)
}

export async function getCurrentUser() {
  await delay()
  return DB.currentUser
}

export async function publishPost(payload: { title: string; forumSlug: string; content: string }) {
  await delay(600)
  // Mock 发布：返回模拟的新帖 id
  return { id: 'p-new-' + Date.now().toString(36), status: 'published' as const }
}

export function getForumBySlugSync(slug: string) {
  return DB.forums.find((f) => f.slug === slug)
}
