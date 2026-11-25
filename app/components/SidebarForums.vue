<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { Forum, Topic } from '~/../shared/types'

defineProps<{
  forums?: Forum[]
  topics?: Topic[]
  joinedHint?: string
}>()
const { isJoined, toggleJoin } = useInteraction()
const toast = useToast()
</script>

<template>
  <div v-if="forums?.length" class="card p-[18px]">
    <div class="flex items-center justify-between mb-3.5">
      <h3 class="text-[15px] font-bold text-ink">今日热门吧</h3>
      <NuxtLink to="/forums" class="text-[12.5px] text-brand hover:underline">更多</NuxtLink>
    </div>
    <div class="space-y-3">
      <div v-for="f in forums" :key="f.id" class="flex items-center gap-2.5">
        <NuxtLink :to="'/f/' + f.slug" class="min-w-0">
          <UserAvatar :name="f.name" :colors="f.avatarColors" :size="32" />
        </NuxtLink>
        <div class="flex-1 min-w-0">
          <NuxtLink :to="'/f/' + f.slug" class="block text-[13.5px] font-semibold text-ink truncate hover:text-brand">{{ f.name }}</NuxtLink>
          <p class="text-[12px] text-muted">{{ formatCount(f.memberCount) }} 成员 · 今日 {{ f.todayPosts }} 帖</p>
        </div>
        <button
          v-if="!isJoined(f.slug)"
          class="btn btn-soft !h-[28px] !px-2.5 text-[12px] flex-none"
          @click="toggleJoin(f); toast.success(`已加入「${f.name}」`)"
        ><Plus :size="13" /> 加入</button>
        <span v-else class="text-[12px] text-success flex-none">已加入</span>
      </div>
    </div>
    <p v-if="joinedHint" class="mt-3 text-[12px] text-muted border-t border-line pt-3">{{ joinedHint }}</p>
  </div>
</template>
