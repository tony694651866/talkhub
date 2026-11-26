// TalkHub Service 层：页面与组件只允许通过这里取数。
// 所有函数封装对 Nitro server/api（/api/*）的 $fetch 调用：
// - SSR 阶段 $fetch 走进程内直调（不经过网络），
// - 客户端阶段走 HTTP 请求同一套接口。
// 数据源在后端（server/api 内部读取 app/utils/mock-data.ts），
// 后续切换真实后端只需改 server/api 实现，页面代码零改动。
import type {
  HomePayload, Post, Comment, Forum, User, Notification, Topic, SearchResult,
} from '~/../shared/types'

export type PostTab = 'recommend' | 'follow' | 'hot' | 'latest'

/** FetchError 是否为 404 */
function is404(e: unknown): boolean {
  const err = e as { statusCode?: number; status?: number } | undefined
  return err?.statusCode === 404 || err?.status === 404
}

/** 资源不存在时解析为 undefined，由页面统一 throw createError({ statusCode: 404, fatal: true }) */
async function nullable<T>(p: Promise<T>): Promise<T | undefined> {
  try {
    return await p
  } catch (e) {
    if (is404(e)) return undefined
    throw e
  }
}

// ---------- 查询 ----------
export async function getHome(): Promise<HomePayload> {
  return $fetch<HomePayload>('/api/home')
}

export async function getPostFeed(tab: PostTab, page = 1, pageSize = 6) {
  return $fetch<{ list: Post[]; total: number; hasMore: boolean }>('/api/feed', { query: { tab, page, pageSize } })
}

export async function getForumList(opts: { category?: string; sort?: 'hot' | 'active' | 'new' | 'member'; keyword?: string } = {}): Promise<Forum[]> {
  return $fetch<Forum[]>('/api/forums', { query: { category: opts.category, sort: opts.sort, keyword: opts.keyword } })
}

export async function getForum(slug: string): Promise<Forum | undefined> {
  return nullable($fetch<Forum>(`/api/forums/${encodeURIComponent(slug)}`))
}

export async function getForumPosts(slug: string, tab: string): Promise<Post[]> {
  const r = await nullable($fetch<{ list: Post[] }>(`/api/forums/${encodeURIComponent(slug)}/posts`, { query: { tab } }))
  return r?.list ?? []
}

export async function getPost(id: string): Promise<Post | undefined> {
  return nullable($fetch<Post>(`/api/posts/${encodeURIComponent(id)}`))
}

export async function getPostComments(postId: string, sort: 'hot' | 'latest' = 'hot'): Promise<Comment[]> {
  return $fetch<Comment[]>(`/api/posts/${encodeURIComponent(postId)}/comments`, { query: { sort } })
}

export async function searchAll(keyword: string): Promise<SearchResult> {
  return $fetch<SearchResult>('/api/search', { query: { q: keyword } })
}

export async function getNotifications(): Promise<Notification[]> {
  return $fetch<Notification[]>('/api/notifications')
}

export async function getUsers(): Promise<User[]> {
  return $fetch<User[]>('/api/users')
}

export async function getUser(username: string): Promise<User | undefined> {
  return nullable($fetch<User>(`/api/users/${encodeURIComponent(username)}`))
}

export async function getUserPosts(username: string): Promise<Post[]> {
  return $fetch<Post[]>(`/api/users/${encodeURIComponent(username)}/posts`)
}

export async function getRankings(range: 'today' | 'week' | 'month', tab: 'posts' | 'forums' | 'authors' | 'topics'): Promise<Array<Post | Forum | User | Topic>> {
  return $fetch<Array<Post | Forum | User | Topic>>('/api/rankings', { query: { range, tab } })
}

export async function getCurrentUser(): Promise<User | undefined> {
  return nullable($fetch<User>('/api/users/me'))
}

export async function publishPost(payload: { title: string; forumSlug: string; content: string }) {
  return $fetch<{ id: string; status: 'published' }>('/api/posts', { method: 'POST', body: payload })
}
