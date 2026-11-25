<script setup lang="ts">
import { Users, FileText, Plus } from 'lucide-vue-next'
import type { Forum } from '~/../shared/types'

const props = defineProps<{ forum: Forum }>()
const { isJoined, toggleJoin } = useInteraction()
const toast = useToast()

const onJoin = () => {
  const joined = toggleJoin(props.forum)
  toast.success(joined ? `已加入「${props.forum.name}」` : '已退出该吧')
}
</script>

<template>
  <article class="card card-hover overflow-hidden group">
    <div class="cover-grad relative h-[108px] transition-transform duration-300 group-hover:scale-[1.03]" :style="{ background: `linear-gradient(135deg, ${forum.coverColors[0]}, ${forum.coverColors[1]})` }">
      <span class="absolute inset-0 flex items-center justify-center">
        <span class="text-white/90"><AppIcon :name="forum.icon" :size="30" :stroke-width="1.6" /></span>
      </span>
    </div>
    <div class="px-4 pb-4 relative">
      <div class="absolute -top-6 left-4 rounded-full ring-[3px] ring-white">
        <UserAvatar :name="forum.name" :colors="forum.avatarColors" :size="48" />
      </div>
      <div class="pt-8">
        <div class="flex items-start justify-between gap-2">
          <NuxtLink :to="'/f/' + forum.slug" class="min-w-0">
            <h3 class="text-[16px] font-bold text-ink truncate hover:text-brand transition-colors">{{ forum.name }}</h3>
            <p class="text-[12px] text-muted mt-0.5">{{ forum.category }}吧</p>
          </NuxtLink>
          <button
            v-if="!isJoined(forum.slug)"
            class="btn btn-soft btn-sm flex-none"
            @click="onJoin"
          ><Plus :size="14" /> 加入</button>
          <NuxtLink v-else :to="'/f/' + forum.slug" class="btn btn-secondary btn-sm flex-none">已加入</NuxtLink>
        </div>
        <p class="mt-2 text-[13px] text-secondary leading-relaxed line-clamp-2 min-h-[40px]">{{ forum.description }}</p>
        <div class="mt-2.5 flex items-center gap-4 text-[12.5px] text-muted">
          <span class="flex items-center gap-1"><Users :size="13" /> {{ formatCount(forum.memberCount) }} 成员</span>
          <span class="flex items-center gap-1"><FileText :size="13" /> 今日 {{ forum.todayPosts }} 帖</span>
        </div>
      </div>
    </div>
  </article>
</template>
