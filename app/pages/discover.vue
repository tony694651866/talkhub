<script setup lang="ts">
import { Search, Flame, TrendingUp, Star, ArrowRight } from 'lucide-vue-next'
import type { Forum, Post } from '~/../shared/types'
import { getForumList, getPostFeed } from '~/services/api'

useSiteSeo({
  title: '发现兴趣 · TalkHub',
  description: '发现你感兴趣的吧、话题和帖子，找到与你同频的人和圈子。',
  type: 'website',
})

const keyword = ref('')
const featuredForums = ref<Forum[]>([])
const emergingForums = ref<Forum[]>([])
const hotPosts = ref<Post[]>([])
const loading = ref(true)

const router = useRouter()
const submitSearch = () => {
  if (!keyword.value.trim()) return
  router.push({ path: '/search', query: { q: keyword.value.trim() } })
}

onMounted(async () => {
  const [all, newForums, feed] = await Promise.all([
    getForumList({ sort: 'hot' }),
    getForumList({ sort: 'new' }),
    getPostFeed('hot', 1, 4),
  ])
  featuredForums.value = all.slice(0, 6)
  emergingForums.value = newForums.slice(0, 3)
  hotPosts.value = feed.list
  loading.value = false
})
</script>

<template>
  <div class="container-site">
    <!-- 页头 -->
    <div class="rise-in">
      <h1 class="text-[26px] font-bold text-ink">发现兴趣</h1>
      <p class="mt-1 text-[14px] text-secondary">找到与你同频的人和圈子</p>
    </div>

    <!-- 搜索 + 热门话题 -->
    <div class="mt-5 flex flex-col sm:flex-row gap-3 rise-in-1">
      <form class="relative flex-1 max-w-[560px]" @submit.prevent="submitSearch">
        <Search :size="17" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input v-model="keyword" class="input !pl-10 !h-11" placeholder="搜索你感兴趣的吧、话题或帖子" aria-label="搜索兴趣">
      </form>
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span class="pill pill-hot flex-none"><Flame :size="12" /> 热门话题</span>
        <NuxtLink v-for="t in ['AI Agent 落地', '年度游戏', '十月新番', '城市夜色', '马拉松备赛']" :key="t"
          :to="{ path: '/search', query: { q: t } }"
          class="pill pill-brand flex-none hover:!bg-brand hover:!text-white transition-colors"
        ># {{ t }}</NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4 fade-in">
      <div v-for="i in 6" :key="i" class="skeleton h-[240px] rounded-[14px]" />
    </div>

    <template v-else>
      <!-- 编辑精选 Banner -->
      <section class="mt-8 rise-in-2">
        <h2 class="text-[19px] font-bold text-ink mb-3.5">编辑精选</h2>
        <NuxtLink to="/f/photo" class="card card-hover relative overflow-hidden h-[170px] flex items-center group">
          <div class="absolute inset-0 bg-gradient-to-r from-[#b45309] to-[#f59e0b]" />
          <div class="relative px-8 flex-1">
            <span class="pill bg-white/20 text-white">社区活动</span>
            <h3 class="mt-2.5 text-white text-[22px] font-bold">「城市夜色」摄影作品征集</h3>
            <p class="mt-1 text-white/85 text-[13.5px] max-w-[420px]">11 月 30 日截稿 · 优秀作品在首页精选展出</p>
            <span class="mt-3 inline-flex items-center gap-1.5 text-white text-[13.5px] font-semibold group-hover:gap-3 transition-all">立即参加 <ArrowRight :size="15" /></span>
          </div>
          <span class="relative hidden sm:flex items-center justify-center w-[280px] h-full">
            <span class="absolute right-8 top-6 w-48 h-36 rounded-[14px] rotate-3 bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <AppIcon name="camera" :size="34" class="text-white/80" />
            </span>
          </span>
        </NuxtLink>
      </section>

      <!-- 推荐吧 -->
      <section class="mt-8 rise-in-3">
        <div class="flex items-center justify-between mb-3.5">
          <h2 class="text-[19px] font-bold text-ink">推荐吧</h2>
          <NuxtLink to="/forums" class="text-[13px] text-brand hover:underline">进入吧广场 →</NuxtLink>
        </div>
        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ForumCard v-for="f in featuredForums" :key="f.id" :forum="f" />
        </div>
      </section>

      <!-- 热门帖子 + 新兴社区 -->
      <div class="mt-8 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <section>
          <h2 class="text-[19px] font-bold text-ink mb-3.5">热门帖子</h2>
          <div class="space-y-3">
            <PostCard v-for="p in hotPosts" :key="p.id" :post="p" />
          </div>
        </section>
        <aside class="hidden lg:block sticky top-[84px]">
          <div class="card p-[18px]">
            <h3 class="text-[15px] font-bold text-ink mb-3.5 flex items-center gap-2"><TrendingUp :size="16" class="text-hot" /> 新兴社区</h3>
            <div class="space-y-3">
              <NuxtLink v-for="f in emergingForums" :key="f.id" :to="'/f/' + f.slug" class="flex items-center gap-2.5 group">
                <UserAvatar :name="f.name" :colors="f.avatarColors" :size="36" />
                <div class="flex-1 min-w-0">
                  <p class="text-[13.5px] font-semibold text-ink truncate group-hover:text-brand transition-colors">{{ f.name }}</p>
                  <p class="text-[12px] text-muted">{{ formatCount(f.memberCount) }} 成员 · 近期增长活跃</p>
                </div>
                <Star :size="14" class="text-warning flex-none" />
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
