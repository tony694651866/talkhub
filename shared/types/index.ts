// TalkHub 共享类型定义（Mock 与真实 API 保持相同结构）

export interface User {
  id: string
  username: string
  nickname: string
  bio: string
  avatarColors: [string, string]
  level: number
  points: number
  followers: number
  following: number
  joinedAt: string
  coverColors: [string, string]
}

export interface Forum {
  id: string
  slug: string
  name: string
  category: string
  description: string
  coverColors: [string, string]
  avatarColors: [string, string]
  icon: string
  memberCount: number
  postCount: number
  todayPosts: number
  createdAt: string
  owner: string
  moderators: string[]
  rules: string[]
  announcements: { id: string; title: string; date: string }[]
  tags: string[]
  joined?: boolean
}

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'code'; lang: string; text: string }
  | { type: 'img'; src: string; alt: string; colors: [string, string] }
  | { type: 'ul'; items: string[] }

export interface Post {
  id: string
  title: string
  forumSlug: string
  forumName: string
  forumAvatarColors: [string, string]
  author: string
  authorNickname: string
  authorColors: [string, string]
  createdAt: string
  excerpt: string
  content: ContentBlock[]
  images: { colors: [string, string]; alt: string }[]
  viewCount: number
  likeCount: number
  commentCount: number
  favoriteCount: number
  tags: string[]
  badges: ('top' | 'essence' | 'hot' | 'vote' | 'notice')[]
  type: 'text' | 'image' | 'vote'
  vote?: { options: { label: string; count: number }[]; deadline: string; total: number }
  liked?: boolean
  favorited?: boolean
}

export interface Comment {
  id: string
  post: string
  author: string
  authorNickname: string
  authorColors: [string, string]
  createdAt: string
  content: string
  likeCount: number
  replies: Comment[]
  liked?: boolean
}

export interface HeroSlide {
  id: string
  eyebrow: string
  title: string
  description: string
  tags: string[]
  actionText: string
  actionUrl: string
  secondaryActionText?: string
  secondaryActionUrl?: string
  colors: [string, string]
  thumbColors: [string, string]
}

export interface Topic {
  id: string
  name: string
  heat: number
  postCount: number
}

export interface Announcement {
  id: string
  title: string
  date: string
}

export interface HomePayload {
  heroSlides: HeroSlide[]
  categories: { name: string; icon: string; color: string; forumCount: number }[]
  recommendedForums: Forum[]
  hotPosts: Post[]
  trendingTopics: Topic[]
  activeUsers: User[]
  announcements: Announcement[]
}

export interface Notification {
  id: string
  category: 'reply' | 'like' | 'follow' | 'system' | 'mod'
  actor: string
  actorNickname: string
  actorColors: [string, string]
  action: string
  target: string
  targetUrl: string
  time: string
  read: boolean
}

export interface SearchResult {
  posts: Post[]
  forums: Forum[]
  users: User[]
  topics: Topic[]
}
