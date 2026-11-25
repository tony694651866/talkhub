<script setup lang="ts">
import { Search, Bell, PenSquare, ChevronDown, User as UserIcon, FileText, Star, Settings, LogOut, Home, Compass, LayoutGrid, Trophy } from 'lucide-vue-next'
import { currentUser } from '~/utils/mock-data'
import { getForumList, searchAll } from '~/services/api'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userMenu = ref(false)
const userMenuRef = ref<HTMLElement>()
const searchFocus = ref(false)
const keyword = ref('')
const suggestForums = ref<{ slug: string; name: string }[]>([])
const suggestTopics = ref<string[]>([])

const navs = [
  { label: '首页', to: '/', icon: Home },
  { label: '发现', to: '/discover', icon: Compass },
  { label: '吧广场', to: '/forums', icon: LayoutGrid },
  { label: '排行榜', to: '/rankings', icon: Trophy },
]

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

// 搜索建议（防抖）
let debounce: ReturnType<typeof setTimeout> | null = null
watch(keyword, (kw) => {
  if (debounce) clearTimeout(debounce)
  if (!kw.trim()) { suggestForums.value = []; suggestTopics.value = []; return }
  debounce = setTimeout(async () => {
    const r = await searchAll(kw)
    suggestForums.value = r.forums.slice(0, 3).map((f) => ({ slug: f.slug, name: f.name }))
    suggestTopics.value = r.topics.slice(0, 3).map((t) => t.name)
  }, 180)
})

const submitSearch = () => {
  if (!keyword.value.trim()) return
  searchFocus.value = false
  router.push({ path: '/search', query: { q: keyword.value.trim() } })
}

const onSearchBlur = () => setTimeout(() => (searchFocus.value = false), 150)

const onDocClick = (e: MouseEvent) => {
  if (userMenu.value && userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) userMenu.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))

const onLogout = () => {
  userMenu.value = false
  toast.info('演示模式：当前为 Mock 登录态')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/92 backdrop-blur-md border-b border-line">
    <div class="container-site h-[54px] sm:h-16 flex items-center gap-4 lg:gap-7">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 flex-none" aria-label="TalkHub 首页">
        <span class="relative w-8 h-8 rounded-[10px] bg-gradient-to-br from-brand to-[#7c3aed] flex items-center justify-center shadow-[0_4px_12px_rgba(88,101,232,.35)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z"/><circle cx="9" cy="11.5" r="0.5" fill="#fff"/><circle cx="12.5" cy="11.5" r="0.5" fill="#fff"/><circle cx="16" cy="11.5" r="0.5" fill="#fff"/></svg>
        </span>
        <span class="text-[17px] font-extrabold tracking-tight text-ink hidden sm:block">TalkHub</span>
      </NuxtLink>

      <!-- 主导航（桌面） -->
      <nav class="hidden md:flex items-center gap-[26px] h-full" aria-label="主导航">
        <NuxtLink v-for="n in navs" :key="n.to" :to="n.to" class="relative h-full flex items-center text-[15px] font-medium transition-colors" :class="isActive(n.to) ? 'text-brand font-semibold' : 'text-body hover:text-ink'">
          {{ n.label }}
          <span v-if="isActive(n.to)" class="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-[3px] bg-brand" />
        </NuxtLink>
      </nav>

      <!-- 搜索 -->
      <div class="relative flex-1 min-w-0 md:max-w-[300px] md:ml-2">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          v-model="keyword"
          class="input !h-[38px] !pl-9 hidden md:block"
          placeholder="搜索吧、帖子、话题…"
          aria-label="搜索"
          @focus="searchFocus = true"
          @blur="onSearchBlur"
          @keydown.enter="submitSearch"
        >
        <NuxtLink to="/search" class="md:hidden btn btn-ghost !h-9 !px-2" aria-label="搜索"><Search :size="19" /></NuxtLink>

        <!-- 搜索建议 -->
        <Transition name="fade-in">
          <div v-if="searchFocus && keyword.trim()" class="absolute top-[44px] left-0 right-0 bg-white border border-line rounded-[12px] shadow-[0_14px_36px_rgba(24,30,60,.14)] py-2 z-40 pop-in">
            <template v-if="suggestForums.length || suggestTopics.length">
              <p class="px-4 py-1.5 text-[11.5px] text-muted font-medium">相关吧</p>
              <NuxtLink v-for="f in suggestForums" :key="f.slug" :to="'/f/' + f.slug" class="px-4 h-9 flex items-center gap-2 text-[13.5px] text-body hover:bg-surface-soft" @click="searchFocus = false">
                <span class="w-1.5 h-1.5 rounded-full bg-brand/60" />{{ f.name }}
              </NuxtLink>
              <p class="px-4 py-1.5 text-[11.5px] text-muted font-medium">热门话题</p>
              <NuxtLink v-for="t in suggestTopics" :key="t" :to="{ path: '/search', query: { q: t } }" class="px-4 h-9 flex items-center gap-2 text-[13.5px] text-body hover:bg-surface-soft" @click="searchFocus = false">
                <span class="text-brand">#</span>{{ t }}
              </NuxtLink>
            </template>
            <p v-else class="px-4 py-3 text-[13px] text-secondary">按 Enter 搜索「{{ keyword }}」</p>
          </div>
        </Transition>
      </div>

      <!-- 发布 -->
      <NuxtLink to="/post/create" class="btn btn-primary !h-[38px] !px-3.5 flex-none ml-auto hidden sm:inline-flex" style="width: auto">
        <PenSquare :size="16" /><span class="hidden lg:inline">发布</span>
      </NuxtLink>

      <!-- 消息 -->
      <NuxtLink to="/messages" class="relative btn btn-ghost !h-9 !px-2 flex-none" aria-label="消息通知">
        <Bell :size="19" />
        <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger ring-2 ring-white" />
      </NuxtLink>

      <!-- 头像菜单 -->
      <div ref="userMenuRef" class="relative flex-none">
        <button class="flex items-center gap-1" aria-label="用户菜单" @click="userMenu = !userMenu">
          <UserAvatar :name="currentUser.nickname" :colors="currentUser.avatarColors" :size="34" />
          <ChevronDown :size="13" class="text-muted hidden lg:block" :class="{ 'rotate-180': userMenu }" style="transition: transform .2s" />
        </button>
        <Transition name="fade-in">
          <div v-if="userMenu" class="absolute right-0 top-[46px] w-[190px] bg-white border border-line rounded-[12px] shadow-[0_14px_36px_rgba(24,30,60,.14)] py-1.5 z-40 pop-in">
            <div class="px-4 py-2.5 border-b border-line mb-1.5">
              <p class="text-[14px] font-bold text-ink">{{ currentUser.nickname }}</p>
              <p class="text-[12px] text-muted mt-0.5">Lv.{{ currentUser.level }} · {{ currentUser.points }} 积分</p>
            </div>
            <NuxtLink v-for="item in [
              { label: '我的主页', to: '/u/' + currentUser.username, icon: UserIcon },
              { label: '个人中心', to: '/me', icon: Settings },
              { label: '我的帖子', to: '/me?tab=posts', icon: FileText },
              { label: '我的收藏', to: '/me?tab=favorites', icon: Star },
            ]" :key="item.label" :to="item.to" class="h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-body hover:bg-surface-soft" @click="userMenu = false">
              <component :is="item.icon" :size="15" /> {{ item.label }}
            </NuxtLink>
            <button class="w-full h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-danger hover:bg-[#fdecef]" @click="onLogout">
              <LogOut :size="15" /> 退出登录
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
