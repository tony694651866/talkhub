<script setup lang="ts">
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { getForumList } from '~/services/api'

const route = useRoute()
const router = useRouter()
useSiteSeo({
  title: '吧广场 · TalkHub',
  description: '浏览 TalkHub 全部兴趣吧，按分类、热度与活跃度找到属于你的圈子。',
  type: 'website',
})

const keyword = ref('')
const category = ref((route.query.category as string) || '全部')
const sort = ref<'hot' | 'active' | 'new' | 'member'>('hot')

const categories = ['全部', '游戏', '科技', '影视', '动漫', '生活', '情感', '学习', '运动']
const sorts = [
  { key: 'hot', label: '热门' },
  { key: 'active', label: '最活跃' },
  { key: 'member', label: '成员最多' },
  { key: 'new', label: '最新创建' },
] as const

// 吧列表：SSR 服务端取数，筛选条件变化时带参数重新请求
const { data: forums, pending: loading } = await useAsyncData(
  () => `forums-${category.value}-${sort.value}-${keyword.value}`,
  () => getForumList({ category: category.value, sort: sort.value, keyword: keyword.value }),
  { watch: [category, sort, keyword], default: () => [] },
)
watch(() => route.query.category, (v) => { if (v) category.value = v as string })
</script>

<template>
  <div class="container-site">
    <div class="rise-in flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <h1 class="text-[26px] font-bold text-ink">吧广场</h1>
        <p class="mt-1 text-[14px] text-secondary">{{ forums.length ? `共 ${forums.length} 个吧 · 每天都在生长` : '找到属于你的圈子' }}</p>
      </div>
      <form class="relative w-full sm:w-[300px]" @submit.prevent>
        <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input v-model="keyword" class="input !pl-10" placeholder="搜索吧名称或关键词" aria-label="搜索吧">
      </form>
    </div>

    <!-- 分类 Tab -->
    <div class="mt-5 card px-4 flex gap-6 overflow-x-auto no-scrollbar" role="tablist" aria-label="吧分类">
      <button
        v-for="c in categories"
        :key="c"
        role="tab"
        class="tab-item"
        :class="{ active: category === c }"
        :aria-selected="category === c"
        @click="category = c"
      >{{ c }}</button>
    </div>

    <!-- 筛选条 -->
    <div class="mt-3.5 flex items-center gap-2 flex-wrap">
      <span class="flex items-center gap-1.5 text-[13px] text-secondary mr-1"><SlidersHorizontal :size="14" /> 排序</span>
      <button
        v-for="s in sorts"
        :key="s.key"
        class="pill !h-[26px] cursor-pointer transition-colors"
        :class="sort === s.key ? 'pill-brand' : 'pill-normal hover:bg-brand-soft'"
        @click="sort = s.key"
      >{{ s.label }}</button>
      <button v-if="category !== '全部'" class="pill !h-[26px] pill-hot cursor-pointer" @click="category = '全部'; router.replace({ query: {} })">
        {{ category }} <X :size="12" />
      </button>
    </div>

    <!-- 吧卡片 -->
    <div v-if="loading" class="mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4 fade-in" aria-busy="true">
      <div v-for="i in 6" :key="i" class="skeleton h-[240px] rounded-[14px]" />
    </div>
    <div v-else-if="forums.length" class="mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <ForumCard v-for="f in forums" :key="f.id" :forum="f" class="rise-in" />
    </div>
    <EmptyState
      v-else
      icon="message-circle"
      title="没有找到相关的吧"
      description="换个关键词，或者创建一个属于你的新吧"
      action-text="返回全部"
      @action="keyword = ''; category = '全部'"
    />
  </div>
</template>
