<script setup lang="ts">
import { Inbox, ThumbsUp, UserPlus, Megaphone, ShieldCheck, CheckCheck, Trash2, MessageSquare } from 'lucide-vue-next'
import type { Notification } from '~/../shared/types'
import { getNotifications } from '~/services/api'

useSiteSeo({
  title: '消息中心 · TalkHub',
  description: '查看你的评论回复、点赞、关注与系统通知。',
  noindex: true,
})

const toast = useToast()
const category = ref('all')
const cats = [
  { key: 'all', label: '全部', icon: Inbox },
  { key: 'reply', label: '评论与回复', icon: MessageSquare },
  { key: 'like', label: '点赞与收藏', icon: ThumbsUp },
  { key: 'follow', label: '新关注', icon: UserPlus },
  { key: 'mod', label: '吧管理通知', icon: ShieldCheck },
  { key: 'system', label: '系统公告', icon: Megaphone },
]

const list = ref<Notification[]>([])
const loading = ref(true)
const readIds = ref<string[]>([])
const removedIds = ref<string[]>([])

onMounted(async () => {
  list.value = await getNotifications()
  loading.value = false
})

const filtered = computed(() =>
  list.value.filter((n) => (category.value === 'all' || n.category === category.value) && !removedIds.value.includes(n.id)),
)
const unreadCount = computed(() => list.value.filter((n) => !n.read && !readIds.value.includes(n.id)).length)

const markAll = () => { readIds.value = list.value.map((n) => n.id); toast.success('已全部标记为已读') }
const markOne = (n: Notification) => { if (!readIds.value.includes(n.id)) readIds.value.push(n.id) }
const removeOne = (n: Notification) => { removedIds.value.push(n.id); toast.success('消息已删除') }

const catIcon = (c: string) => cats.find((x) => x.key === c)?.icon ?? Inbox
const catStyle: Record<string, string> = {
  reply: 'bg-brand-soft text-brand',
  like: 'bg-[#e9a23b1a] text-warning',
  follow: 'bg-[#20a7791a] text-success',
  mod: 'bg-[#7a5ce018] text-[#7a5ce0]',
  system: 'bg-surface-soft text-secondary',
}
</script>

<template>
  <div class="container-site max-w-[900px]">
    <div class="flex items-center gap-3">
      <h1 class="text-[26px] font-bold text-ink">消息中心</h1>
      <span v-if="unreadCount" class="pill pill-hot">{{ unreadCount }} 条未读</span>
      <button class="btn btn-secondary btn-sm ml-auto" @click="markAll"><CheckCheck :size="14" /> 全部已读</button>
    </div>

    <div class="mt-5 grid sm:grid-cols-[200px_minmax(0,1fr)] gap-4 items-start">
      <!-- 分类 -->
      <nav class="card p-2.5 flex sm:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="消息分类">
        <button
          v-for="c in cats"
          :key="c.key"
          class="flex items-center gap-2.5 h-9 px-3 rounded-[9px] text-[13.5px] font-medium whitespace-nowrap transition-colors flex-1 sm:flex-none justify-center sm:justify-start"
          :class="category === c.key ? 'bg-brand-soft text-brand' : 'text-body hover:bg-surface-soft'"
          @click="category = c.key"
        >
          <component :is="c.icon" :size="15" />
          {{ c.label }}
          <span v-if="c.key !== 'all' && list.filter((n) => n.category === c.key && !n.read && !readIds.includes(n.id)).length" class="ml-auto w-[18px] h-[18px] rounded-full bg-danger text-white text-[10.5px] font-bold flex items-center justify-center">{{ list.filter((n) => n.category === c.key && !n.read && !readIds.includes(n.id)).length }}</span>
        </button>
      </nav>

      <!-- 列表 -->
      <div class="card divide-y divide-line overflow-hidden">
        <div v-if="loading" class="p-5 space-y-4" aria-busy="true">
          <div v-for="i in 5" :key="i" class="flex gap-3"><div class="skeleton w-9 h-9 rounded-full" /><div class="flex-1 space-y-2"><div class="skeleton h-4 w-2/3" /><div class="skeleton h-3.5 w-1/3" /></div></div>
        </div>
        <template v-else-if="filtered.length">
          <NuxtLink
            v-for="n in filtered"
            :key="n.id"
            :to="n.targetUrl"
            class="flex items-start gap-3.5 px-5 py-4 hover:bg-surface-soft transition-colors"
            :class="{ 'bg-brand-soft/40': !n.read && !readIds.includes(n.id) }"
            @click="markOne(n)"
          >
            <span class="relative flex-none">
              <UserAvatar :name="n.actorNickname" :colors="n.actorColors" :size="36" />
              <span v-if="!n.read && !readIds.includes(n.id)" class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-danger ring-2 ring-white" />
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-[13.5px] text-body">
                <span class="font-semibold text-ink">{{ n.actorNickname }}</span>
                {{ n.action }}
              </p>
              <p class="text-[13px] text-secondary truncate mt-0.5">{{ n.target }}</p>
              <p class="text-[12px] text-muted mt-1">{{ n.time }}</p>
            </div>
            <span class="flex-none w-8 h-8 rounded-full flex items-center justify-center" :class="catStyle[n.category]">
              <component :is="catIcon(n.category)" :size="15" />
            </span>
            <button class="btn btn-ghost !h-7 !w-7 !px-0 flex-none" aria-label="删除消息" @click.prevent="removeOne(n)"><Trash2 :size="14" /></button>
          </NuxtLink>
        </template>
        <EmptyState v-else icon="inbox" title="这里空空如也" description="新的消息会出现在这里" />
      </div>
    </div>
  </div>
</template>
