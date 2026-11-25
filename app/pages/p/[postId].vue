<script setup lang="ts">
import { ChevronRight, ThumbsUp, Star, Share2, MessageSquare, Eye, Flag, Send, BarChart3 } from 'lucide-vue-next'
import type { Comment } from '~/../shared/types'
import { getPost, getPostComments, getForum } from '~/services/api'

const route = useRoute()
const postId = route.params.postId as string

const { data: post, error } = await useAsyncData(`post-${postId}`, () => getPost(postId))
if (error.value || !post.value) {
  throw createError({ statusCode: 404, message: '帖子不存在或已被删除', fatal: true })
}
const siteUrl = useSiteUrl()
useSiteSeo({
  title: () => `${post.value?.title ?? ''} · TalkHub`,
  description: () => post.value?.excerpt ?? '',
  type: 'article',
  canonicalPath: `/p/${postId}`,
  jsonLd: () => {
    const p = post.value
    if (!p) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      headline: p.title,
      description: p.excerpt,
      url: `${siteUrl}/p/${p.id}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/p/${p.id}` },
      author: {
        '@type': 'Person',
        name: p.authorNickname,
        url: `${siteUrl}/u/${p.author}`,
      },
      articleSection: p.forumName,
      keywords: p.tags.join(', '),
      interactionStatistic: [
        { '@type': 'InteractionCounter', interactionType: { '@type': 'LikeAction' }, userInteractionCount: p.likeCount },
        { '@type': 'InteractionCounter', interactionType: { '@type': 'CommentAction' }, userInteractionCount: p.commentCount },
      ],
    }
  },
})

const { data: forum } = await useAsyncData(`forum-of-${postId}`, () => getForum(post.value!.forumSlug))

const { isLiked, toggleLike, isFav, toggleFav } = useInteraction()
const toast = useToast()
const beating = ref(false)
const flashLike = () => { beating.value = true; setTimeout(() => (beating.value = false), 420) }
const sharePost = () => {
  navigator.clipboard?.writeText(location.href).catch(() => {})
  toast.success('链接已复制')
}
const lightbox = ref(-1)
const lightboxImages = computed(() =>
  post.value!.content.filter((b): b is { type: 'img'; src: string; alt: string; colors: [string, string] } => b.type === 'img')
    .map((b) => ({ colors: b.colors, alt: b.alt })),
)

// ---------- 投票 ----------
const voteMap = reactive(new Map<string, number>())
const myVote = computed(() => voteMap.get(post.value!.id))
const onVote = (i: number) => {
  if (myVote.value !== undefined) return
  voteMap.set(post.value!.id, i)
  post.value!.vote!.options[i]!.count++
  post.value!.vote!.total++
  toast.success('投票成功，感谢参与！')
}

// ---------- 评论 ----------
const comments = ref<Comment[]>([])
const commentsLoading = ref(true)
const commentSort = ref<'hot' | 'latest'>('hot')
const commentText = ref('')
const replyTarget = ref('')
const sending = ref(false)
const sendBtnRef = ref<HTMLButtonElement>()

watch(commentSort, loadComments)
async function loadComments() {
  commentsLoading.value = true
  comments.value = await getPostComments(post.value!.id, commentSort.value)
  commentsLoading.value = false
}
onMounted(loadComments)

const startReply = (nickname: string) => {
  replyTarget.value = nickname
  sendBtnRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
const sendComment = async () => {
  if (!commentText.value.trim() || sending.value) return
  sending.value = true
  await new Promise((r) => setTimeout(r, 700))
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  comments.value.unshift({
    id: 'c-new-' + Date.now(),
    post: post.value!.id,
    author: 'linwu',
    authorNickname: '林雾',
    authorColors: ['#5865e8', '#8b5cf6'],
    createdAt: '刚刚',
    content: (replyTarget.value ? `回复 @${replyTarget.value}：` : '') + commentText.value,
    likeCount: 0,
    replies: [],
  })
  post.value!.commentCount++
  commentText.value = ''
  replyTarget.value = ''
  sending.value = false
  toast.success('评论发布成功')
}
</script>

<template>
  <div v-if="post" class="container-site">
    <!-- 面包屑 -->
    <nav class="flex items-center gap-1.5 text-[13px] text-secondary mb-4" aria-label="面包屑">
      <NuxtLink to="/" class="hover:text-brand">首页</NuxtLink>
      <ChevronRight :size="13" />
      <NuxtLink :to="'/f/' + post.forumSlug" class="hover:text-brand">{{ post.forumName }}</NuxtLink>
      <ChevronRight :size="13" />
      <span class="text-muted truncate max-w-[300px]">{{ post.title }}</span>
    </nav>

    <div class="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
      <div class="min-w-0">
        <!-- 帖子主体 -->
        <article class="card p-5 sm:p-8">
          <div class="flex items-center gap-2 flex-wrap">
            <StatusPill v-for="b in post.badges" :key="b" :badge="b" />
          </div>
          <h1 class="mt-2.5 text-[22px] sm:text-[26px] font-bold text-ink leading-[1.45]">{{ post.title }}</h1>

          <!-- 作者行 -->
          <div class="mt-4 flex items-center gap-3 pb-5 border-b border-line">
            <NuxtLink :to="'/u/' + post.author"><UserAvatar :name="post.authorNickname" :colors="post.authorColors" :size="38" /></NuxtLink>
            <div class="flex-1 min-w-0">
              <NuxtLink :to="'/u/' + post.author" class="text-[14px] font-semibold text-ink hover:text-brand">{{ post.authorNickname }}</NuxtLink>
              <p class="text-[12.5px] text-muted">发布于 {{ post.createdAt }} · <Eye :size="12" class="inline -mt-0.5" /> {{ formatCount(post.viewCount) }} 浏览</p>
            </div>
            <button class="btn btn-ghost !h-8" aria-label="举报" @click="toast.info('已收到举报，我们会尽快处理')"><Flag :size="16" /></button>
          </div>

          <!-- 正文 -->
          <div class="prose-post mt-6">
            <template v-for="(b, i) in post.content" :key="i">
              <p v-if="b.type === 'p'">{{ b.text }}</p>
              <h2 v-else-if="b.type === 'h2'">{{ b.text }}</h2>
              <blockquote v-else-if="b.type === 'quote'">{{ b.text }}</blockquote>
              <pre v-else-if="b.type === 'code'"><code>{{ b.text }}</code></pre>
              <ul v-else-if="b.type === 'ul'">
                <li v-for="item in b.items" :key="item">{{ item }}</li>
              </ul>
              <img
                v-else-if="b.type === 'img'"
                :src="'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${b.colors[0]}'/><stop offset='1' stop-color='${b.colors[1]}'/></linearGradient></defs><rect width='800' height='450' rx='18' fill='url(#g)'/><circle cx='640' cy='120' r='90' fill='white' opacity='0.14'/><circle cx='180' cy='360' r='60' fill='white' opacity='0.1'/><text x='400' y='232' text-anchor='middle' font-family='sans-serif' font-size='22' fill='white' opacity='0.92'>${b.alt}</text></svg>`)"
                :alt="b.alt"
                loading="lazy"
                @click="lightbox = lightboxImages.findIndex((img) => img.alt === b.alt)"
              >
            </template>
          </div>

          <!-- 投票区 -->
          <div v-if="post.vote" class="mt-6 card !shadow-none !bg-surface-soft p-5">
            <div class="flex items-center gap-2 mb-4">
              <BarChart3 :size="17" class="text-brand" />
              <span class="text-[15px] font-bold text-ink">投票 · {{ post.vote.deadline }} 截止</span>
              <span class="text-[12.5px] text-muted ml-auto">{{ formatCount(post.vote.total) }} 人已投</span>
            </div>
            <div class="space-y-3">
              <button
                v-for="(opt, i) in post.vote.options"
                :key="opt.label"
                class="w-full text-left relative rounded-[10px] overflow-hidden border transition-colors"
                :class="myVote === i ? 'border-brand' : 'border-line hover:border-brand/50'"
                :disabled="myVote !== undefined"
                @click="onVote(i)"
              >
                <span
                  v-if="myVote !== undefined"
                  class="absolute inset-y-0 left-0 bg-brand/12 transition-all duration-500"
                  :style="{ width: (opt.count / post.vote!.total * 100) + '%' }"
                />
                <span class="relative flex items-center justify-between px-4 py-2.5">
                  <span class="text-[14px]" :class="myVote === i ? 'text-brand font-semibold' : 'text-body'">
                    {{ myVote === i ? '✓ ' : '' }}{{ opt.label }}
                  </span>
                  <span class="text-[13px] text-muted">{{ myVote !== undefined ? Math.round(opt.count / post.vote!.total * 100) + '%' : formatCount(opt.count) + ' 票' }}</span>
                </span>
              </button>
            </div>
          </div>

          <!-- 话题标签 -->
          <div v-if="post.tags.length" class="mt-6 flex gap-2 flex-wrap">
            <NuxtLink v-for="t in post.tags" :key="t" :to="{ path: '/search', query: { q: t } }" class="pill pill-normal hover:bg-brand-soft hover:text-brand transition-colors"># {{ t }}</NuxtLink>
          </div>

          <!-- 互动栏 -->
          <div class="mt-6 pt-5 border-t border-line flex items-center gap-2">
            <button class="btn btn-soft" :class="{ '!bg-brand !text-white': isLiked(post.id) }" @click="toggleLike(post); flashLike(); toast.success(isLiked(post.id) ? '已点赞' : '已取消点赞')">
              <ThumbsUp :size="16" :class="{ 'heart-beat': beating, 'fill-current': isLiked(post.id) }" /> {{ formatCount(post.likeCount) }}
            </button>
            <a href="#comments" class="btn btn-soft"><MessageSquare :size="16" /> {{ formatCount(post.commentCount) }}</a>
            <button class="btn btn-soft" :class="{ '!bg-warning/15 !text-warning': isFav(post.id) }" @click="toggleFav(post); toast.success(isFav(post.id) ? '已加入收藏' : '已取消收藏')">
              <Star :size="16" :class="{ 'fill-current': isFav(post.id) }" /> 收藏
            </button>
            <button class="btn btn-ghost ml-auto" @click="sharePost()">
              <Share2 :size="16" /> 分享
            </button>
          </div>
        </article>

        <!-- 评论区 -->
        <section id="comments" class="card mt-5 p-5 sm:p-7 scroll-mt-24">
          <div class="flex items-center gap-4">
            <h2 class="text-[17px] font-bold text-ink">全部评论（{{ post.commentCount }}）</h2>
            <div class="ml-auto flex gap-1">
              <button class="pill !h-[26px] cursor-pointer transition-colors" :class="commentSort === 'hot' ? 'pill-brand' : 'pill-normal'" @click="commentSort = 'hot'">最热</button>
              <button class="pill !h-[26px] cursor-pointer transition-colors" :class="commentSort === 'latest' ? 'pill-brand' : 'pill-normal'" @click="commentSort = 'latest'">最新</button>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="mt-4 bg-surface-soft rounded-[12px] p-3.5 border border-line focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(88,101,232,.12)] transition-all">
            <div v-if="replyTarget" class="flex items-center gap-2 mb-2">
              <span class="pill pill-brand">回复 @{{ replyTarget }}</span>
              <button class="text-[12px] text-muted hover:text-danger" @click="replyTarget = ''">取消</button>
            </div>
            <textarea
              v-model="commentText"
              rows="2"
              class="w-full bg-transparent border-0 outline-none resize-none text-[14px] text-ink placeholder:text-muted"
              placeholder="说说你的看法……"
              maxlength="500"
            />
            <div class="flex items-center justify-between mt-2">
              <span class="text-[12px] text-muted">{{ 500 - commentText.length }} / 500</span>
              <button ref="sendBtnRef" class="btn btn-primary btn-sm" :disabled="!commentText.trim() || sending" @click="sendComment">
                <Send v-if="!sending" :size="14" />
                <span v-else class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {{ sending ? '发送中' : '发送' }}
              </button>
            </div>
          </div>

          <!-- 评论列表 -->
          <div v-if="commentsLoading" class="mt-6 space-y-5" aria-busy="true">
            <div v-for="i in 3" :key="i" class="flex gap-3">
              <div class="skeleton w-[34px] h-[34px] rounded-full flex-none" />
              <div class="flex-1 space-y-2"><div class="skeleton h-4 w-28" /><div class="skeleton h-4 w-full" /><div class="skeleton h-4 w-2/3" /></div>
            </div>
          </div>
          <div v-else-if="comments.length" class="mt-4 divide-y divide-line">
            <CommentItem v-for="c in comments" :key="c.id" :comment="c" @reply="startReply" />
          </div>
          <EmptyState v-else icon="message-circle" title="还没有评论" description="来说出第一条评论，让讨论开始" />
        </section>
      </div>

      <!-- 右侧辅助栏 -->
      <aside class="hidden lg:flex flex-col gap-4 sticky top-[84px]">
        <NuxtLink v-if="forum" :to="'/f/' + forum.slug" class="card card-hover p-[18px] flex items-center gap-3">
          <UserAvatar :name="forum.name" :colors="forum.avatarColors" :size="44" />
          <div class="min-w-0">
            <p class="text-[14.5px] font-bold text-ink">{{ forum.name }}</p>
            <p class="text-[12px] text-muted">{{ formatCount(forum.memberCount) }} 成员 · 今日 {{ forum.todayPosts }} 帖</p>
          </div>
        </NuxtLink>
        <div class="card p-[18px]">
          <h3 class="text-[15px] font-bold text-ink mb-3">相关话题</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink v-for="t in post.tags" :key="t" :to="{ path: '/search', query: { q: t } }" class="pill pill-normal hover:bg-brand-soft hover:text-brand transition-colors"># {{ t }}</NuxtLink>
          </div>
        </div>
      </aside>
    </div>

    <!-- 灯箱 -->
    <Lightbox v-if="lightbox >= 0" :images="lightboxImages" :index="lightbox" @close="lightbox = -1" @update="lightbox = $event" />
  </div>
</template>
