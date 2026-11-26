import { forums } from '../../../../app/utils/mock-data'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const forum = forums.find((f) => f.slug === slug)
  if (!forum) {
    throw createError({ statusCode: 404, statusMessage: 'Forum Not Found' })
  }
  return forum
})
