<script setup lang="ts">
import { ChevronRight, LoaderCircle } from 'lucide-vue-next'
import type { Post } from '~/../shared/types'
import { getHome, getPostFeed, type PostTab } from '~/services/api'

useSiteSeo({
  title: 'TalkHub · 兴趣讨论社区',
  description: 'TalkHub —— 以兴趣圈子为单位的现代化讨论社区。找到你的吧，加入讨论。',
  type: 'website',
})

// SSR 首屏：首页聚合数据 + 默认分区帖子
const { data: home } = await useAsyncData('home', () => getHome())

const activeTab = ref<PostTab>('recommend')
const { data: feed, pending: feedPending } = await useAsyncData(
  () => `feed-${activeTab.value}`,
  () => getPostFeed(activeTab.value, 1),
  { watch: [activeTab] },
)

const extraPosts = ref<Post[]>([])
const page = ref(1)
const hasMore = ref(true)
const loadingMore = ref(false)

watch(activeTab, () => { extraPosts.value = []; page.value = 1; hasMore.value = true })
watch(feed, (f) => { if (f) hasMore.value = f.hasMore })

const posts = computed(() => [...(feed.value?.list ?? []), ...extraPosts.value])

async function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  page.value++
  const r = await getPostFeed(activeTab.value, page.value)
  extraPosts.value.push(...r.list)
  hasMore.value = r.hasMore
  loadingMore.value = false
}

const tabs: { key: PostTab; label: string }[] = [
  { key: 'recommend', label: '推荐' },
  { key: 'follow', label: '关注' },
  { key: 'hot', label: '热门' },
  { key: 'latest', label: '最新' },
]
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="!home" class="container-site space-y-6 fade-in" aria-busy="true" aria-label="页面加载中">      <div class="skeleton h-[210px] sm:h-[300px] rounded-[20px]" />
      <div class="skeleton h-16 rounded-[14px]" />
      <div class="grid lg:grid-cols-[820px_300px] gap-6 justify-center">
        <div class="space-y-3"><SkeletonPost /><SkeletonPost /><SkeletonPost /></div>
        <div class="space-y-4"><div class="skeleton h-44 rounded-[14px]" /><div class="skeleton h-32 rounded-[14px]" /></div>
      </div>
    </div>

    <template v-else>
      <!-- Hero 轮播 -->
      <div class="container-site">
        <HeroCarousel :slides="home.heroSlides" />
      </div>

      <!-- 分类快捷入口 -->
      <div class="container-site mt-5">
        <div class="card py-3.5 px-3 flex gap-1 overflow-x-auto no-scrollbar">
          <NuxtLink
            v-for="c in home.categories"
            :key="c.name"
            :to="{ path: '/forums', query: { category: c.name } }"
            class="flex-none flex flex-col items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] group transition-colors hover:bg-brand-soft"
          >
            <span
              class="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              :style="{ background: c.color + '14', color: c.color }"
            >
              <AppIcon :name="c.icon" :size="20" />
            </span>
            <span class="text-[12px] text-body group-hover:text-brand font-medium">{{ c.name }}</span>
          </NuxtLink>
          <NuxtLink to="/forums" class="flex-none flex flex-col items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] group transition-colors hover:bg-brand-soft">
            <span class="w-11 h-11 rounded-full bg-surface-soft text-secondary flex items-center justify-center group-hover:scale-110 transition-all duration-200">
              <ChevronRight :size="20" />
            </span>
            <span class="text-[12px] text-body group-hover:text-brand font-medium">更多</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 双栏主体 -->
      <div class="container-site mt-6 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div>
          <!-- Tab -->
          <div class="card px-4 flex items-center gap-6 sticky top-[64px] lg:top-[68px] z-30 rounded-[14px]">
            <div class="flex gap-6">
              <button
                v-for="t in tabs"
                :key="t.key"
                class="tab-item"
                :class="{ active: activeTab === t.key }"
                @click="activeTab = t.key"
              >{{ t.label }}</button>
            </div>
            <NuxtLink to="/post/create" class="ml-auto text-[13px] font-semibold text-brand hover:underline flex-none">写帖子 →</NuxtLink>
          </div>

          <!-- 帖子流 -->
          <div class="mt-3.5 space-y-3">
            <template v-if="!feedPending">
              <PostCard v-for="p in posts" :key="p.id" :post="p" />
            </template>
            <div v-if="feedPending" class="space-y-3"><SkeletonPost /><SkeletonPost /></div>
            <EmptyState
              v-else-if="!posts.length"
              icon="sparkles"
              title="这里还没有内容"
              description="关注一些感兴趣的吧，让首页热闹起来"
              action-text="去发现吧"
              @action="navigateTo('/discover')"
            />
            <div v-else-if="hasMore" class="flex justify-center pt-1">
              <button class="btn btn-secondary" :disabled="loadingMore" @click="loadMore">
                <LoaderCircle v-if="loadingMore" :size="15" class="animate-spin" />
                {{ loadingMore ? '加载中…' : '加载更多' }}
              </button>
            </div>
            <p v-else class="text-center text-[12.5px] text-muted py-3">— 到底啦，去别的分区逛逛吧 —</p>
          </div>
        </div>

        <!-- 侧栏 -->
        <aside class="hidden lg:flex flex-col gap-4 sticky top-[84px]">
          <SidebarForums :forums="home.recommendedForums" />
          <SidebarWidgets :topics="home.trendingTopics" :announcements="home.announcements" :users="home.activeUsers" />
        </aside>
      </div>
    </template>
  </div>
</template>
