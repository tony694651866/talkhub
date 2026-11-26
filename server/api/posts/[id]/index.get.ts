import { posts } from '../../../../app/utils/mock-data'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const post = posts.find((p) => p.id === id)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post Not Found' })
  }
  return post
})
