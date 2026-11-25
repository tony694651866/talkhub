<script setup lang="ts">
import { ScrollText, Megaphone } from 'lucide-vue-next'
import { getForum } from '~/services/api'

const route = useRoute()
const slug = route.params.slug as string
const { data: forum } = await useAsyncData(`forum-${slug}-rules`, () => getForum(slug))
if (!forum.value) throw createError({ statusCode: 404, message: '吧不存在', fatal: true })
useSiteSeo({
  title: () => `${forum.value?.name ?? ''} · 吧规与公告 · TalkHub`,
  description: () => `${forum.value?.name ?? ''} 的吧规与公告，发布于 TalkHub。`,
  canonicalPath: `/f/${slug}/rules`,
})
</script>

<template>
  <div v-if="forum" class="container-site max-w-[820px] space-y-4">
    <NuxtLink :to="'/f/' + forum.slug" class="inline-flex items-center gap-1.5 text-[13.5px] text-secondary hover:text-brand"><ScrollText :size="15" /> 返回 {{ forum.name }}</NuxtLink>

    <div class="card p-6">
      <h1 class="text-[20px] font-bold text-ink flex items-center gap-2"><ScrollText :size="19" class="text-brand" /> {{ forum.name }} · 吧规</h1>
      <ol class="mt-4 space-y-3">
        <li v-for="(r, i) in forum.rules" :key="r" class="flex gap-3 text-[14.5px] text-body leading-relaxed bg-surface-soft rounded-[10px] p-3.5">
          <span class="w-[22px] h-[22px] flex-none rounded-full bg-brand text-white text-[12px] font-bold flex items-center justify-center">{{ i + 1 }}</span>
          {{ r }}
        </li>
      </ol>
      <p class="mt-4 text-[13px] text-muted">违反吧规的内容将被删除，多次违规将被禁言或移出本吧。最终解释权归吧务团队所有。</p>
    </div>

    <div class="card p-6">
      <h2 class="text-[17px] font-bold text-ink flex items-center gap-2"><Megaphone :size="17" class="text-warning" /> 吧公告</h2>
      <div v-if="forum.announcements.length" class="mt-4 space-y-3">
        <div v-for="a in forum.announcements" :key="a.id" class="border border-line rounded-[10px] p-4">
          <p class="text-[14.5px] font-semibold text-ink">{{ a.title }}</p>
          <p class="text-[12.5px] text-muted mt-1">发布于 {{ a.date }}</p>
        </div>
      </div>
      <p v-else class="mt-3 text-[13.5px] text-muted">本吧暂无公告。</p>
    </div>
  </div>
</template>
