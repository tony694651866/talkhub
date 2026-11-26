<script setup lang="ts">
import { Megaphone, Users, FileText, Zap, Plus, Check, MoreHorizontal, Shield, ScrollText, ArrowLeft } from 'lucide-vue-next'
import { getForum, getForumPosts, getUsers } from '~/services/api'

const route = useRoute()
const slug = route.params.slug as string

const { data: forum, error } = await useAsyncData(`forum-${slug}`, () => getForum(slug))
if (error.value || !forum.value) {
  throw createError({ statusCode: 404, message: '吧不存在', fatal: true })
}

const siteUrl = useSiteUrl()
useSiteSeo({
  title: () => `${forum.value?.name ?? ''} · TalkHub`,
  description: () => forum.value?.description ?? '',
  type: 'website',
  canonicalPath: `/f/${slug}`,
  jsonLd: () => {
    const f = forum.value
    if (!f) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForum',
      name: f.name,
      description: f.description,
      url: `${siteUrl}/f/${f.slug}`,
      numberOfMembers: f.memberCount,
    }
  },
})

const { isJoined, toggleJoin } = useInteraction()
const toast = useToast()
const showMoreMenu = ref(false)

// 帖子列表：SSR 服务端取数，tab 切换时带参数重新请求
const tab = ref('all')
const tabs = [
  { key: 'all', label: '综合' },
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '热门' },
  { key: 'essence', label: '精华' },
  { key: 'image', label: '图片' },
  { key: 'vote', label: '投票' },
]
const { data: postsData, pending: loading } = await useAsyncData(
  () => `forum-posts-${slug}-${tab.value}`,
  () => getForumPosts(slug, tab.value),
  { watch: [tab] },
)
const posts = computed(() => postsData.value ?? [])

const onJoin = () => {
  const joined = toggleJoin(forum.value!)
  toast.success(joined ? `欢迎加入「${forum.value!.name}」` : '已退出该吧')
}

// 成员昵称/头像色：通过 /api/users 请求获取
const { data: allUsers } = await useAsyncData('users-all', () => getUsers())
const userNickname = (username: string) =>
  allUsers.value?.find((u) => u.username === username)?.nickname ?? username
const userColors = (username: string): [string, string] =>
  allUsers.value?.find((u) => u.username === username)?.avatarColors ?? ['#5865e8', '#8b5cf6']
</script>

<template>
  <div v-if="forum" class="container-site">
    <!-- 封面区 -->
    <section class="relative rounded-[14px] sm:rounded-[18px] overflow-hidden h-[190px] sm:h-[230px]">
      <div class="absolute inset-0 cover-grad" :style="{ background: `linear-gradient(120deg, ${forum.coverColors[0]}, ${forum.coverColors[1]})` }">
        <span class="absolute -right-10 -top-16 w-64 h-64 rounded-full opacity-20" style="background: radial-gradient(circle, #fff, transparent 60%); filter: blur(30px)" />
        <span class="absolute right-10 bottom-0 w-44 h-44 opacity-10" :style="{ backgroundImage: 'radial-gradient(#fff 1.4px, transparent 1.4px)', backgroundSize: '14px 14px' }" />
        <span class="absolute right-6 top-6 text-white/40"><AppIcon :name="forum.icon" :size="56" :stroke-width="1.2" /></span>
      </div>
      <!-- 底部深色渐层 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

      <div class="relative h-full flex flex-col justify-end p-5 sm:p-6">
        <div class="flex items-end gap-4">
          <span class="sm:hidden ring-[3px] ring-white rounded-full flex-none">
            <UserAvatar :name="forum.name" :colors="forum.avatarColors" :size="58" />
          </span>
          <span class="hidden sm:block ring-[3px] ring-white rounded-full flex-none">
            <UserAvatar :name="forum.name" :colors="forum.avatarColors" :size="76" />
          </span>
          <div class="min-w-0 flex-1 pb-0.5">
            <h1 class="text-white text-[20px] sm:text-[26px] font-bold drop-shadow-sm">{{ forum.name }}</h1>
            <p class="hidden sm:block text-white/85 text-[13.5px] line-clamp-2 mt-1 max-w-[560px]">{{ forum.description }}</p>
            <div class="mt-1.5 flex items-center gap-3.5 text-white/80 text-[12px] sm:text-[12.5px]">
              <span class="flex items-center gap-1"><Users :size="13" /> {{ formatCount(forum.memberCount) }} 成员</span>
              <span class="flex items-center gap-1"><FileText :size="13" /> {{ formatCount(forum.postCount) }} 帖子</span>
              <span class="flex items-center gap-1"><Zap :size="13" /> 今日 {{ forum.todayPosts }}</span>
            </div>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="mt-3.5 flex items-center gap-2.5">
          <button v-if="!isJoined(forum.slug)" class="btn btn-primary !h-[38px]" @click="onJoin"><Plus :size="16" /> 加入吧</button>
          <button v-else class="btn btn-secondary !h-[38px] !bg-white/90" @click="onJoin"><Check :size="15" class="text-success" /> 已加入</button>
          <NuxtLink to="/post/create" class="btn btn-soft !h-[38px] !bg-white !text-ink hover:!bg-white/90">发帖</NuxtLink>
          <div class="relative">
            <button class="btn btn-ghost !h-[38px] !text-white/85 hover:!bg-white/15" aria-label="更多" @click="showMoreMenu = !showMoreMenu"><MoreHorizontal :size="18" /></button>
            <Transition name="fade-in">
              <div v-if="showMoreMenu" class="absolute left-0 bottom-12 w-[160px] bg-white rounded-[10px] shadow-pop py-1.5 z-20 pop-in">
                <button class="w-full h-9 px-4 text-left text-[13.5px] text-body hover:bg-surface-soft flex items-center gap-2" @click="showMoreMenu = false; toast.success('链接已复制')">
                  <Shield :size="14" /> 分享本吧
                </button>
                <NuxtLink :to="'/f/' + forum.slug + '/rules'" class="w-full h-9 px-4 text-left text-[13.5px] text-body hover:bg-surface-soft flex items-center gap-2" @click="showMoreMenu = false">
                  <ScrollText :size="14" /> 吧规
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 公告条 -->
    <NuxtLink
      v-if="forum.announcements.length"
      :to="'/f/' + forum.slug + '/rules'"
      class="mt-4 card card-hover !rounded-[10px] px-4 py-2.5 flex items-center gap-2.5"
    >
      <Megaphone :size="15" class="text-brand flex-none" />
      <span class="pill pill-notice flex-none">公告</span>
      <span class="text-[13.5px] text-body truncate flex-1">{{ forum.announcements[0]?.title }}</span>
      <span class="text-[12.5px] text-muted flex-none">{{ forum.announcements[0]?.date }}</span>
    </NuxtLink>

    <!-- 双栏 -->
    <div class="mt-5 grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
      <div>
        <div class="card px-4 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button v-for="t in tabs" :key="t.key" class="tab-item" :class="{ active: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
        </div>
        <div class="mt-3.5 space-y-3">
          <div v-if="loading" class="space-y-3"><SkeletonPost /><SkeletonPost /><SkeletonPost /></div>
          <template v-else-if="posts.length">
            <PostCard v-for="p in posts" :key="p.id" :post="p" :show-forum="false" />
          </template>
          <EmptyState
            v-else
            icon="sparkles"
            title="这个分区还没有帖子"
            description="来发第一帖，成为这里的开拓者"
            action-text="立即发帖"
            @action="navigateTo('/post/create')"
          />
        </div>
      </div>

      <!-- 吧信息侧栏 -->
      <aside class="hidden lg:flex flex-col gap-4 sticky top-[84px]">
        <div class="card p-[18px]">
          <h3 class="text-[15px] font-bold text-ink mb-2.5">吧简介</h3>
          <p class="text-[13.5px] text-body leading-relaxed">{{ forum.description }}</p>
          <p class="text-[12px] text-muted mt-2.5">创建于 {{ forum.createdAt }} · {{ forum.category }}分类</p>
        </div>
        <div class="card p-[18px]">
          <h3 class="text-[15px] font-bold text-ink mb-2.5">吧主与吧务</h3>
          <div class="space-y-2.5">
            <div v-for="m in forum.moderators" :key="m" class="flex items-center gap-2.5">
              <UserAvatar :name="userNickname(m)" :colors="userColors(m)" :size="30" />
              <span class="text-[13.5px] text-body flex-1">{{ userNickname(m) }}</span>
              <span class="pill" :class="m === forum.owner ? 'pill-essence' : 'pill-normal'">{{ m === forum.owner ? '吧主' : '吧务' }}</span>
            </div>
          </div>
          <NuxtLink :to="'/manage/f/' + forum.id" class="btn btn-secondary btn-sm w-full mt-3.5"><Shield :size="14" /> 吧管理中心</NuxtLink>
        </div>
        <div class="card p-[18px]">
          <h3 class="text-[15px] font-bold text-ink mb-3">热门标签</h3>
          <div class="flex flex-wrap gap-2">
            <NuxtLink v-for="t in forum.tags" :key="t" :to="{ path: '/search', query: { q: t } }" class="pill pill-normal hover:bg-brand-soft hover:text-brand transition-colors"># {{ t }}</NuxtLink>
          </div>
        </div>
        <div class="card p-[18px]">
          <h3 class="text-[15px] font-bold text-ink mb-2.5">吧规速览</h3>
          <ol class="space-y-2">
            <li v-for="(r, i) in forum.rules" :key="r" class="flex gap-2 text-[13px] text-body">
              <span class="w-4.5 h-4.5 flex-none w-[18px] h-[18px] rounded-full bg-brand-soft text-brand text-[11px] font-bold flex items-center justify-center mt-0.5">{{ i + 1 }}</span>
              {{ r }}
            </li>
          </ol>
        </div>
      </aside>
    </div>
  </div>
</template>
