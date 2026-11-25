<script setup lang="ts">
import { Search, X, Clock, Flame, Users, MessageSquare } from 'lucide-vue-next'
import type { SearchResult } from '~/../shared/types'
import { searchAll } from '~/services/api'

const route = useRoute()
const router = useRouter()
useSiteSeo({
  title: () => `搜索${route.query.q ? '：' + route.query.q : ''} · TalkHub`,
  description: '在 TalkHub 搜索帖子、吧、用户与话题。',
  noindex: true,
})

const keyword = ref((route.query.q as string) || '')
const tab = ref<'all' | 'posts' | 'forums' | 'users' | 'topics'>('all')
const result = ref<SearchResult | null>(null)
const loading = ref(false)
const searched = ref(false)
const history = ref<string[]>([])

watch(() => route.query.q, (q) => { if (q) doSearch(q as string) })
onMounted(() => {
  const saved = localStorage.getItem('th-search-history')
  if (saved) history.value = JSON.parse(saved)
  if (keyword.value) doSearch(keyword.value)
})

const tabs = [
  { key: 'all', label: '综合' },
  { key: 'posts', label: '帖子' },
  { key: 'forums', label: '吧' },
  { key: 'users', label: '用户' },
  { key: 'topics', label: '话题' },
] as const

async function doSearch(q?: string) {
  const kw = (q ?? keyword.value).trim()
  if (!kw) return
  keyword.value = kw
  loading.value = true
  searched.value = true
  tab.value = 'all'
  result.value = await searchAll(kw)
  loading.value = false
  history.value = [kw, ...history.value.filter((h) => h !== kw)].slice(0, 6)
  localStorage.setItem('th-search-history', JSON.stringify(history.value))
  if (route.query.q !== kw) router.replace({ query: { q: kw } })
}
const clearHistory = () => { history.value = []; localStorage.removeItem('th-search-history') }

const empty = computed(() => result.value && !result.value.posts.length && !result.value.forums.length && !result.value.users.length && !result.value.topics.length)
</script>

<template>
  <div class="container-site max-w-[900px]">
    <!-- 搜索框 -->
    <form class="relative" @submit.prevent="doSearch()">
      <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input v-model="keyword" class="input !h-12 !pl-11 !pr-10 !text-[15px]" placeholder="搜索帖子、吧、用户、话题…" aria-label="搜索">
      <button v-if="keyword" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label="清空" @click="keyword = ''"><X :size="16" /></button>
    </form>

    <!-- 未搜索：历史 + 热门 -->
    <div v-if="!searched" class="mt-8 space-y-7">
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Clock :size="15" class="text-secondary" />
          <h2 class="text-[15px] font-bold text-ink">搜索历史</h2>
          <button v-if="history.length" class="ml-auto text-[12.5px] text-muted hover:text-danger" @click="clearHistory">清空</button>
        </div>
        <div v-if="history.length" class="flex flex-wrap gap-2">
          <button v-for="h in history" :key="h" class="pill pill-normal cursor-pointer hover:bg-brand-soft hover:text-brand" @click="doSearch(h)">{{ h }}</button>
        </div>
        <p v-else class="text-[13px] text-muted">暂无搜索记录</p>
      </div>
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Flame :size="15" class="text-hot" />
          <h2 class="text-[15px] font-bold text-ink">热门搜索</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="t in ['AI Agent 落地', '年度游戏', '十月新番', '城市夜色', '效率工具', '独立开发', '马拉松备赛', '手机摄影']" :key="t" class="pill pill-brand cursor-pointer hover:!bg-brand hover:!text-white transition-colors" @click="doSearch(t)">
            # {{ t }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果 -->
    <template v-else>
      <div class="mt-5 card px-4 flex gap-6 overflow-x-auto no-scrollbar">
        <button v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: tab === t.key }" @click="tab = t.key">
          {{ t.label }}
          <span v-if="result" class="text-[12px] text-muted">({{ tab === 'posts' ? result.posts.length : tab === 'forums' ? result.forums.length : tab === 'users' ? result.users.length : tab === 'topics' ? result.topics.length : result.posts.length + result.forums.length + result.users.length + result.topics.length }})</span>
        </button>
      </div>

      <div v-if="loading" class="mt-5 space-y-3" aria-busy="true"><SkeletonPost /><SkeletonPost /></div>

      <template v-else>
        <div v-if="tab === 'all' || tab === 'posts'" class="mt-4 space-y-3">
          <PostCard v-for="p in result!.posts" :key="p.id" :post="p" />
        </div>

        <div v-if="tab === 'all' && result!.forums.length" class="mt-6">
          <h3 class="text-[15px] font-bold text-ink mb-3 flex items-center gap-2"><MessageSquare :size="15" class="text-brand" /> 相关吧</h3>
          <div class="grid sm:grid-cols-2 gap-3">
            <NuxtLink v-for="f in result!.forums" :key="f.id" :to="'/f/' + f.slug" class="card card-hover p-4 flex items-center gap-3">
              <UserAvatar :name="f.name" :colors="f.avatarColors" :size="42" />
              <div class="min-w-0">
                <p class="text-[14.5px] font-bold text-ink">{{ f.name }}</p>
                <p class="text-[12.5px] text-muted truncate">{{ formatCount(f.memberCount) }} 成员 · {{ f.category }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="tab === 'all' && result!.users.length" class="mt-6">
          <h3 class="text-[15px] font-bold text-ink mb-3 flex items-center gap-2"><Users :size="15" class="text-brand" /> 相关用户</h3>
          <div class="grid sm:grid-cols-2 gap-3">
            <NuxtLink v-for="u in result!.users" :key="u.id" :to="'/u/' + u.username" class="card card-hover p-4 flex items-center gap-3">
              <UserAvatar :name="u.nickname" :colors="u.avatarColors" :size="40" />
              <div class="min-w-0">
                <p class="text-[14px] font-bold text-ink">{{ u.nickname }}</p>
                <p class="text-[12.5px] text-muted truncate">{{ u.bio }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="tab === 'topics' && result!.topics.length" class="mt-4 flex flex-wrap gap-2">
          <button v-for="t in result!.topics" :key="t.id" class="pill pill-brand !h-[30px] cursor-pointer" @click="doSearch(t.name)"># {{ t.name }} · {{ t.postCount }} 条讨论</button>
        </div>

        <EmptyState
          v-if="empty && tab !== 'topics'"
          icon="search"
          title="没有找到相关内容"
          description="试试更短的关键词，或看看热门话题"
        />
        <div v-if="empty && tab !== 'topics'" class="mt-4 flex flex-wrap gap-2 justify-center">
          <button v-for="t in ['AI Agent', '游戏', '新番', '摄影', '跑步']" :key="t" class="pill pill-normal cursor-pointer hover:bg-brand-soft" @click="doSearch(t)">{{ t }}</button>
        </div>
      </template>
    </template>
  </div>
</template>
