<script setup lang="ts">
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-vue-next'
import type { Post, Forum, User, Topic } from '~/../shared/types'
import { getRankings } from '~/services/api'

useSiteSeo({
  title: '排行榜 · TalkHub',
  description: 'TalkHub 热门帖子、活跃吧、优质作者与热门话题排行榜，每小时更新。',
  type: 'website',
})

const tab = ref<'posts' | 'forums' | 'authors' | 'topics'>('posts')
const range = ref<'today' | 'week' | 'month'>('week')
const loading = ref(true)
const rankList = ref<any[]>([])

const tabs = [
  { key: 'posts', label: '热门帖子' },
  { key: 'forums', label: '活跃吧' },
  { key: 'authors', label: '优质作者' },
  { key: 'topics', label: '热门话题' },
] as const
const ranges = [
  { key: 'today', label: '今日' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
] as const

const rangeText = { today: '今日', week: '本周', month: '本月' }

watch([tab, range], load, { immediate: true })
async function load() {
  loading.value = true
  rankList.value = await getRankings(range.value, tab.value)
  loading.value = false
}

const trendOf = (i: number) => (i === 0 ? 'up' : i === 1 ? 'up' : i % 3 === 2 ? 'down' : 'flat')
const metricText = (item: any) => {
  switch (tab.value) {
    case 'posts': return formatCount(item.likeCount) + ' 赞'
    case 'forums': return '今日 ' + item.todayPosts + ' 帖'
    case 'authors': return formatCount(item.followers) + ' 粉丝'
    default: return formatCount(item.heat) + ' 热度'
  }
}
</script>

<template>
  <div class="container-site max-w-[900px]">
    <div class="rise-in flex items-center gap-3">
      <span class="w-11 h-11 rounded-[12px] bg-gradient-to-br from-warning to-hot text-white flex items-center justify-center shadow-[0_6px_16px_rgba(240,120,72,.35)]">
        <Trophy :size="22" />
      </span>
      <div>
        <h1 class="text-[26px] font-bold text-ink">排行榜</h1>
        <p class="text-[13px] text-secondary">统计周期：{{ rangeText[range] }} · 每小时更新</p>
      </div>
    </div>

    <div class="mt-5 card px-4 py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
      <div class="flex gap-6">
        <button v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
      </div>
      <div class="flex gap-1.5 flex-none">
        <button v-for="r in ranges" :key="r.key" class="pill !h-[26px] cursor-pointer transition-colors" :class="range === r.key ? 'pill-brand' : 'pill-normal'" @click="range = r.key">{{ r.label }}</button>
      </div>
    </div>

    <div v-if="loading" class="mt-5 space-y-3" aria-busy="true">
      <div v-for="i in 6" :key="i" class="skeleton h-[76px] rounded-[14px]" />
    </div>

    <div v-else class="mt-4 card divide-y divide-line overflow-hidden">
      <div v-for="(item, i) in rankList" :key="i" class="flex items-center gap-3.5 px-5 py-3.5 hover:bg-surface-soft transition-colors">
        <span
          class="w-7 h-7 rounded-[8px] flex-none flex items-center justify-center text-[13px] font-extrabold"
          :class="i < 3 ? 'bg-gradient-to-br from-warning to-hot text-white shadow-sm' : 'bg-surface-soft text-secondary'"
        >{{ i + 1 }}</span>

        <template v-if="tab === 'posts'">
          <NuxtLink :to="'/p/' + item.id" class="flex-1 min-w-0 group">
            <p class="text-[14.5px] font-semibold text-ink truncate group-hover:text-brand transition-colors">{{ item.title }}</p>
            <p class="text-[12.5px] text-muted mt-0.5">{{ item.forumName }} · {{ item.authorNickname }} · {{ metricText(item) }}</p>
          </NuxtLink>
        </template>
        <template v-else-if="tab === 'forums'">
          <NuxtLink :to="'/f/' + item.slug" class="flex-1 min-w-0 flex items-center gap-3 group">
            <UserAvatar :name="item.name" :colors="item.avatarColors" :size="38" />
            <div class="min-w-0">
              <p class="text-[14.5px] font-semibold text-ink truncate group-hover:text-brand transition-colors">{{ item.name }}</p>
              <p class="text-[12.5px] text-muted">{{ formatCount(item.memberCount) }} 成员 · {{ metricText(item) }}</p>
            </div>
          </NuxtLink>
        </template>
        <template v-else-if="tab === 'authors'">
          <NuxtLink :to="'/u/' + item.username" class="flex-1 min-w-0 flex items-center gap-3 group">
            <UserAvatar :name="item.nickname" :colors="item.avatarColors" :size="38" />
            <div class="min-w-0">
              <p class="text-[14.5px] font-semibold text-ink truncate group-hover:text-brand transition-colors">{{ item.nickname }}</p>
              <p class="text-[12.5px] text-muted truncate">{{ item.bio }}</p>
            </div>
          </NuxtLink>
        </template>
        <template v-else>
          <div class="flex-1 min-w-0">
            <p class="text-[14.5px] font-semibold text-ink truncate"># {{ item.name }}</p>
            <p class="text-[12.5px] text-muted">{{ metricText(item) }} · {{ item.postCount }} 条讨论</p>
          </div>
        </template>

        <span class="flex-none flex items-center gap-1 text-[12.5px] font-semibold" :class="trendOf(i) === 'up' ? 'text-danger' : trendOf(i) === 'down' ? 'text-success' : 'text-muted'">
          <TrendingUp v-if="trendOf(i) === 'up'" :size="14" />
          <TrendingDown v-else-if="trendOf(i) === 'down'" :size="14" />
          <Minus v-else :size="14" />
          {{ trendOf(i) === 'up' ? '↑' : trendOf(i) === 'down' ? '↓' : '—' }}
        </span>
      </div>
    </div>
  </div>
</template>
