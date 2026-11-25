<script setup lang="ts">
import { Flame, Megaphone, Sparkles } from 'lucide-vue-next'
import type { Topic, Announcement, User } from '~/../shared/types'

defineProps<{
  topics?: Topic[]
  announcements?: Announcement[]
  users?: User[]
}>()

const toast = useToast()
</script>

<template>
  <div v-if="topics?.length" class="card p-[18px]">
    <h3 class="text-[15px] font-bold text-ink mb-3.5">热门话题</h3>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="t in topics"
        :key="t.id"
        :to="{ path: '/search', query: { q: t.name } }"
        class="pill pill-normal hover:bg-brand-soft hover:text-brand transition-colors !h-[24px]"
        :title="`${t.postCount} 条讨论`"
      >
        <Flame v-if="t.heat > 6000" :size="12" class="text-hot" /># {{ t.name }}
      </NuxtLink>
    </div>
  </div>

  <div v-if="announcements?.length" class="card p-[18px]">
    <div class="flex items-center gap-2 mb-3">
      <Megaphone :size="16" class="text-brand" />
      <h3 class="text-[15px] font-bold text-ink">社区公告</h3>
    </div>
    <div class="space-y-2.5">
      <NuxtLink v-for="a in announcements" :key="a.id" to="/" class="block group">
        <p class="text-[13.5px] text-body leading-snug line-clamp-2 group-hover:text-brand transition-colors">{{ a.title }}</p>
        <p class="text-[12px] text-muted mt-0.5">{{ a.date }}</p>
      </NuxtLink>
    </div>
  </div>

  <div v-if="users?.length" class="card p-[18px]">
    <div class="flex items-center gap-2 mb-3.5">
      <Sparkles :size="16" class="text-warning" />
      <h3 class="text-[15px] font-bold text-ink">活跃用户</h3>
    </div>
    <div class="space-y-3">
      <div v-for="u in users" :key="u.id" class="flex items-center gap-2.5">
        <NuxtLink :to="'/u/' + u.username"><UserAvatar :name="u.nickname" :colors="u.avatarColors" :size="32" /></NuxtLink>
        <div class="flex-1 min-w-0">
          <NuxtLink :to="'/u/' + u.username" class="block text-[13.5px] font-semibold text-ink truncate hover:text-brand">{{ u.nickname }}</NuxtLink>
          <p class="text-[12px] text-muted truncate">{{ u.bio }}</p>
        </div>
        <button class="btn btn-secondary !h-[28px] !px-2.5 text-[12px] flex-none" @click="toast.success(`已关注「${u.nickname}」`)">关注</button>
      </div>
    </div>
  </div>
</template>
