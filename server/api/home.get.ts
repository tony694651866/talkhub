import type { HomePayload } from '../../shared/types'
import { announcements, categories, forums, heroSlides, posts, topics, users } from '../../app/utils/mock-data'

export default defineEventHandler((): HomePayload => ({
  heroSlides,
  categories,
  recommendedForums: forums.slice(0, 5),
  hotPosts: [...posts].sort((a, b) => b.likeCount - a.likeCount).slice(0, 5),
  trendingTopics: topics.slice(0, 8),
  activeUsers: users.slice(0, 4),
  announcements,
}))
