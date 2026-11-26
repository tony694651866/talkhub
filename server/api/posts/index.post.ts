// Mock 发布：返回模拟的新帖 id（真实后端接入前仅做演示）
export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string; forumSlug?: string; content?: string }>(event)
  if (!body?.title || !body?.forumSlug || !body?.content) {
    throw createError({ statusCode: 400, statusMessage: 'title / forumSlug / content 均为必填' })
  }
  return { id: 'p-new-' + Date.now().toString(36), status: 'published' as const }
})
