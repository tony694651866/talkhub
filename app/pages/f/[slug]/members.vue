<script setup lang="ts">
import { Shield, MessageSquareHeart, Eye } from 'lucide-vue-next'
import { getForum, getUsers } from '~/services/api'

const route = useRoute()
const slug = route.params.slug as string
const { data: forum } = await useAsyncData(`forum-${slug}-members`, () => getForum(slug))
if (!forum.value) throw createError({ statusCode: 404, message: '吧不存在', fatal: true })
useSiteSeo({
  title: () => `${forum.value?.name ?? ''} · 成员 · TalkHub`,
  description: () => `查看 ${forum.value?.name ?? ''} 的吧主、吧务与活跃成员。`,
  canonicalPath: `/f/${slug}/members`,
})

const keyword = ref('')
const roleFilter = ref('全部')
const roles = ['全部', '吧主', '吧务', '成员']

// 成员列表：通过 /api/users 请求获取
const { data: allUsers } = await useAsyncData('users-all', () => getUsers())
const members = computed(() => {
  const list = (allUsers.value ?? []).map((u) => ({
    ...u,
    role: forum.value!.owner === u.username ? '吧主' : forum.value!.moderators.includes(u.username) ? '吧务' : '成员',
  }))
  return list.filter((u) =>
    (roleFilter.value === '全部' || u.role === roleFilter.value) &&
    (!keyword.value || (u.nickname + u.username).includes(keyword.value)),
  )
})
</script>

<template>
  <div v-if="forum" class="container-site max-w-[820px]">
    <NuxtLink :to="'/f/' + forum.slug" class="inline-flex items-center gap-1.5 text-[13.5px] text-secondary hover:text-brand mb-3"><Shield :size="15" /> 返回 {{ forum.name }}</NuxtLink>
    <div class="card">
      <div class="px-5 py-4 border-b border-line">
        <h1 class="text-[20px] font-bold text-ink">成员管理</h1>
        <p class="text-[13px] text-muted mt-0.5">共 {{ formatCount(forum.memberCount) }} 位成员 · 展示最近活跃成员</p>
      </div>
      <div class="px-5 py-3 flex flex-col sm:flex-row gap-2.5 border-b border-line">
        <input v-model="keyword" class="input !h-9 sm:max-w-[240px]" placeholder="搜索成员昵称" aria-label="搜索成员">
        <div class="flex gap-2">
          <button v-for="r in roles" :key="r" class="pill !h-[26px] cursor-pointer transition-colors" :class="roleFilter === r ? 'pill-brand' : 'pill-normal'" @click="roleFilter = r">{{ r }}</button>
        </div>
      </div>
      <div class="divide-y divide-line">
        <div v-for="m in members" :key="m.id" class="px-5 py-3.5 flex items-center gap-3">
          <UserAvatar :name="m.nickname" :colors="m.avatarColors" :size="36" />
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-semibold text-ink">{{ m.nickname }}</p>
            <p class="text-[12.5px] text-muted truncate">{{ m.bio }}</p>
          </div>
          <span class="pill" :class="m.role === '吧主' ? 'pill-essence' : m.role === '吧务' ? 'pill-brand' : 'pill-normal'">{{ m.role }}</span>
          <span class="hidden sm:flex items-center gap-1 text-[12px] text-muted w-[72px]"><Eye :size="12" /> Lv.{{ m.level }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
