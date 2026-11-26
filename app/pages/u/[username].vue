<script setup lang="ts">
import { MessageSquarePlus, UserCheck, UserPlus, CalendarDays } from 'lucide-vue-next'
import type { Post } from '~/../shared/types'
import { getCurrentUser, getUser, getUserPosts } from '~/services/api'

const route = useRoute()
const username = route.params.username as string

const { data: user, error } = await useAsyncData(`user-${username}`, () => getUser(username))
if (error.value || !user.value) {
  throw createError({ statusCode: 404, message: '用户不存在', fatal: true })
}
const siteUrl = useSiteUrl()
useSiteSeo({
  title: () => `${user.value?.nickname ?? ''} · TalkHub`,
  description: () => user.value?.bio ?? '',
  type: 'profile',
  canonicalPath: `/u/${username}`,
  jsonLd: () => {
    const u = user.value
    if (!u) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: u.nickname,
      description: u.bio,
      url: `${siteUrl}/u/${u.username}`,
      mainEntity: {
        '@type': 'Person',
        name: u.nickname,
        url: `${siteUrl}/u/${u.username}`,
      },
    }
  },
})

// 当前登录用户（Mock 会话）：通过 /api/users/me 请求获取
const { data: meData } = await useAsyncData('current-user', () => getCurrentUser())
const isSelf = computed(() => user.value!.username === meData.value?.username)
const { isFollowed, toggleFollow } = useInteraction()
const toast = useToast()

// 帖子列表：SSR 服务端取数，tab 切换时带参数重新请求
const tab = ref<'posts' | 'replies' | 'forums' | 'favorites'>('posts')
const tabs = [
  { key: 'posts', label: '帖子' },
  { key: 'replies', label: '回复' },
  { key: 'forums', label: '加入的吧' },
  { key: 'favorites', label: '公开收藏' },
] as const

const { data: postsData, pending: loading } = await useAsyncData(
  () => `user-posts-${username}-${tab.value}`,
  () => (tab.value === 'posts' ? getUserPosts(username) : Promise.resolve([] as Post[])),
  { watch: [tab] },
)
const posts = computed(() => postsData.value ?? [])
const onFollow = () => {
  toggleFollow(username)
  toast.success(isFollowed(username) ? `已关注 ${user.value!.nickname}` : '已取消关注')
}
</script>

<template>
  <div v-if="user" class="container-site max-w-[900px]">
    <!-- 封面 + 资料 -->
    <div class="card overflow-hidden">
      <div class="cover-grad relative h-[180px]" :style="{ background: `linear-gradient(120deg, ${user.coverColors[0]}, ${user.coverColors[1]})` }">
        <span class="absolute -right-8 -top-12 w-56 h-56 rounded-full opacity-20" style="background: radial-gradient(circle, #fff, transparent 60%); filter: blur(24px)" />
        <span class="absolute right-8 bottom-4 opacity-10" style="width: 160px; height: 120px; background-image: radial-gradient(#fff 1.3px, transparent 1.3px); background-size: 13px 13px" />
      </div>
      <div class="px-5 sm:px-7 pb-5 relative">
        <span class="absolute -top-11 left-5 sm:left-7 ring-4 ring-white rounded-full">
          <UserAvatar :name="user.nickname" :colors="user.avatarColors" :size="88" />
        </span>
        <div class="pt-14 sm:pt-16 flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-[22px] font-bold text-ink">{{ user.nickname }}</h1>
            <p class="mt-1 text-[13.5px] text-secondary">{{ user.bio }}</p>
            <p class="mt-1.5 text-[12.5px] text-muted flex items-center gap-1.5 flex-wrap">
              <span class="pill pill-essence">Lv.{{ user.level }}</span>
              <CalendarDays :size="13" /> {{ user.joinedAt }} 加入 · {{ formatCount(user.points) }} 积分
            </p>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="text-center px-3.5">
              <p class="text-[17px] font-bold text-ink">{{ user.following }}</p>
              <p class="text-[12px] text-muted">关注</p>
            </div>
            <div class="w-px h-8 bg-line" />
            <div class="text-center px-3.5">
              <p class="text-[17px] font-bold text-ink">{{ formatCount(user.followers) }}</p>
              <p class="text-[12px] text-muted">粉丝</p>
            </div>
            <button v-if="!isSelf && !isFollowed(username)" class="btn btn-primary !h-[38px]" @click="onFollow"><UserPlus :size="15" /> 关注</button>
            <button v-else-if="!isSelf" class="btn btn-secondary !h-[38px]" @click="onFollow"><UserCheck :size="15" class="text-success" /> 已关注</button>
            <button v-else class="btn btn-secondary !h-[38px]" @click="navigateTo('/me')">编辑资料</button>
            <button v-if="!isSelf" class="btn btn-ghost !h-[38px] !px-2.5" aria-label="私信" @click="toast.info('私信功能即将开放')"><MessageSquarePlus :size="17" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容 Tab -->
    <div class="mt-5 card px-4 flex gap-6 overflow-x-auto no-scrollbar">
      <button v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
    </div>

    <div class="mt-3.5 space-y-3">
      <template v-if="tab === 'posts'">
        <div v-if="loading" class="space-y-3"><SkeletonPost /><SkeletonPost /></div>
        <template v-else-if="posts.length">
          <PostCard v-for="p in posts" :key="p.id" :post="p" :show-forum="true" />
        </template>
        <EmptyState v-else icon="file-text" title="还没有发布帖子" :description="isSelf ? '去发第一帖吧' : 'TA 还没有公开的帖子'" />
      </template>
      <EmptyState v-else-if="tab === 'replies'" icon="message-circle" title="暂无公开回复" description="TA 参与的讨论会显示在这里" />
      <EmptyState v-else-if="tab === 'forums'" icon="coffee" title="暂无公开加入的吧" description="加入的兴趣圈子会显示在这里" />
      <EmptyState v-else icon="star" title="收藏默认仅本人可见" description="这是用户的隐私设置" />
    </div>
  </div>
</template>
