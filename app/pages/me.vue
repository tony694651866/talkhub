<script setup lang="ts">
import { LayoutDashboard, FileText, MessageSquare, Star, FileEdit, History, UserPlus, Users, Coffee, Settings, ShieldCheck, BellRing, Trash2, CircleCheck, LoaderCircle } from 'lucide-vue-next'
import type { Post } from '~/../shared/types'
import { getCurrentUser, getUserPosts } from '~/services/api'

useSiteSeo({
  title: '个人中心 · TalkHub',
  description: '管理你的帖子、收藏与个人资料。',
  noindex: true,
})

const route = useRoute()

// 当前登录用户（Mock 会话）：通过 /api/users/me 请求获取
const { data: meData } = await useAsyncData('current-user', () => getCurrentUser())
const currentUser = computed(() => meData.value!)

const tab = ref((route.query.tab as string) || 'overview')
const menu = [
  { key: 'overview', label: '概览', icon: LayoutDashboard },
  { key: 'posts', label: '我的帖子', icon: FileText },
  { key: 'replies', label: '我的回复', icon: MessageSquare },
  { key: 'favorites', label: '我的收藏', icon: Star },
  { key: 'drafts', label: '我的草稿', icon: FileEdit },
  { key: 'history', label: '浏览历史', icon: History },
  { key: 'following', label: '我的关注', icon: UserPlus },
  { key: 'followers', label: '我的粉丝', icon: Users },
  { key: 'forums', label: '加入的吧', icon: Coffee },
  { key: 'profile', label: '账号资料', icon: Settings },
  { key: 'security', label: '安全设置', icon: ShieldCheck },
  { key: 'notify', label: '通知设置', icon: BellRing },
]

const myPosts = ref<Post[]>([])
const loading = ref(true)
const statusFilter = ref('全部')
const statuses = ['全部', '已发布', '审核中', '草稿']

watch(tab, load)
watch(() => route.query.tab, (v) => { if (v) tab.value = v as string })
onMounted(load)
async function load() {
  if (tab.value === 'posts') {
    loading.value = true
    myPosts.value = await getUserPosts(currentUser.value.username)
    loading.value = false
  }
}

const { state, confirm } = useConfirm()
const toast = useToast()
const removed = ref<string[]>([])
const onDelete = async (p: Post) => {
  const ok = await confirm({ title: '删除这条帖子？', description: `「${p.title.slice(0, 18)}…」删除后可在后台恢复（软删除）。`, confirmText: '删除', danger: true })
  if (ok) { removed.value.push(p.id); toast.success('帖子已删除（软删除）') }
}

const mockHistories = ['《我把 AI Agent 接进了日常开发流程》', '「城市夜色」摄影作品精选', '北漂第五年的出租屋指南', '2026 手机影像横评']
const mockForums = ['游戏研究所', '代码搬运工', '摄影取景框']
</script>

<template>
  <div class="container-site grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6 items-start">
    <!-- 左侧菜单 -->
    <aside class="card p-2.5 lg:sticky lg:top-[84px]">
      <div class="px-3 py-3 mb-1">
        <UserAvatar :name="currentUser.nickname" :colors="currentUser.avatarColors" :size="44" />
        <p class="mt-2 text-[15px] font-bold text-ink">{{ currentUser.nickname }}</p>
        <p class="text-[12px] text-muted">Lv.{{ currentUser.level }} · {{ currentUser.points }} 积分</p>
      </div>
      <nav class="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="个人中心菜单">
        <button
          v-for="m in menu"
          :key="m.key"
          class="flex items-center gap-2.5 h-9 px-3 rounded-[9px] text-[13.5px] font-medium whitespace-nowrap transition-colors"
          :class="tab === m.key ? 'bg-brand-soft text-brand' : 'text-body hover:bg-surface-soft'"
          @click="tab = m.key"
        >
          <component :is="m.icon" :size="15" /> {{ m.label }}
        </button>
      </nav>
    </aside>

    <!-- 右侧内容 -->
    <div class="min-w-0 space-y-4">
      <!-- 概览 -->
      <template v-if="tab === 'overview'">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in [
            { label: '帖子', value: myPosts.length || 14, icon: FileText },
            { label: '获赞', value: 3120, icon: Star },
            { label: '粉丝', value: currentUser.followers, icon: Users },
            { label: '加入的吧', value: 5, icon: Coffee },
          ]" :key="s.label" class="card p-4 flex items-center gap-3">
            <span class="w-9 h-9 rounded-[10px] bg-brand-soft text-brand flex items-center justify-center"><component :is="s.icon" :size="17" /></span>
            <div><p class="text-[18px] font-bold text-ink">{{ formatCount(s.value) }}</p><p class="text-[12px] text-muted">{{ s.label }}</p></div>
          </div>
        </div>
        <div class="card p-5">
          <h3 class="text-[15px] font-bold text-ink mb-3">最近帖子</h3>
          <div class="space-y-2.5">
            <NuxtLink v-for="p in myPosts.slice(0, 3)" :key="p.id" :to="'/p/' + p.id" class="flex items-center gap-3 py-1.5 group">
              <span class="w-1 h-8 rounded-full bg-brand/30 group-hover:bg-brand transition-colors flex-none" />
              <span class="flex-1 min-w-0 text-[14px] text-body truncate group-hover:text-brand">{{ p.title }}</span>
              <span class="text-[12px] text-muted flex-none">{{ p.likeCount }} 赞</span>
            </NuxtLink>
          </div>
        </div>
        <div class="card p-5">
          <h3 class="text-[15px] font-bold text-ink mb-3">加入的吧</h3>
          <div class="flex flex-wrap gap-3">
            <NuxtLink v-for="f in mockForums" :key="f" to="/forums" class="flex items-center gap-2 pill pill-normal !h-[32px] !px-3 hover:bg-brand-soft hover:text-brand">
              <UserAvatar :name="f" :colors="['#5865e8', '#8b5cf6']" :size="20" /> {{ f }}
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- 我的帖子 -->
      <template v-else-if="tab === 'posts'">
        <div class="card p-4 flex gap-2 items-center flex-wrap">
          <span class="text-[13px] text-secondary mr-1">状态：</span>
          <button v-for="s in statuses" :key="s" class="pill !h-[26px] cursor-pointer transition-colors" :class="statusFilter === s ? 'pill-brand' : 'pill-normal'" @click="statusFilter = s">{{ s }}</button>
        </div>
        <div v-if="loading" class="space-y-3"><SkeletonPost /></div>
        <div v-else class="card divide-y divide-line overflow-hidden">
          <div v-for="p in myPosts.filter((p) => !removed.includes(p.id))" :key="p.id" class="px-5 py-3.5 flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <NuxtLink :to="'/p/' + p.id" class="text-[14.5px] font-semibold text-ink truncate block hover:text-brand">{{ p.title }}</NuxtLink>
              <p class="text-[12.5px] text-muted mt-0.5">{{ p.forumName }} · {{ p.createdAt }} · {{ p.commentCount }} 评论 · {{ p.likeCount }} 赞</p>
            </div>
            <span class="pill pill-vote flex-none">已发布</span>
            <button class="btn btn-ghost !h-8 flex-none text-danger" aria-label="删除" @click="onDelete(p)"><Trash2 :size="15" /></button>
          </div>
          <p v-if="!myPosts.length" class="px-5 py-8 text-center text-[13.5px] text-muted">还没有发布帖子</p>
        </div>
      </template>

      <!-- 历史等简单列表 -->
      <template v-else-if="tab === 'history'">
        <div class="card divide-y divide-line overflow-hidden">
          <div v-for="(h, i) in mockHistories" :key="i" class="px-5 py-3.5 flex items-center gap-3">
            <History :size="15" class="text-muted flex-none" />
            <span class="flex-1 text-[14px] text-body truncate">{{ h }}</span>
            <span class="text-[12px] text-muted flex-none">{{ 3 - i }} 天前</span>
          </div>
        </div>
      </template>

      <!-- 设置类 -->
      <template v-else-if="['profile', 'security', 'notify'].includes(tab)">
        <div class="card p-6 space-y-5">
          <template v-if="tab === 'profile'">
            <h3 class="text-[16px] font-bold text-ink">账号资料</h3>
            <div class="flex items-center gap-4">
              <UserAvatar :name="currentUser.nickname" :colors="currentUser.avatarColors" :size="64" />
              <button class="btn btn-secondary btn-sm" @click="toast.info('演示模式：头像上传接口待接入')">更换头像</button>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div><label class="text-[13px] font-semibold text-ink block mb-1.5">昵称</label><input class="input" :value="currentUser.nickname"></div>
              <div><label class="text-[13px] font-semibold text-ink block mb-1.5">用户名</label><input class="input bg-surface-soft" :value="currentUser.username" disabled></div>
              <div class="sm:col-span-2"><label class="text-[13px] font-semibold text-ink block mb-1.5">简介</label><input class="input" :value="currentUser.bio"></div>
            </div>
            <button class="btn btn-primary btn-sm" @click="toast.success('资料已保存')"><CircleCheck :size="14" /> 保存修改</button>
          </template>
          <template v-else-if="tab === 'security'">
            <h3 class="text-[16px] font-bold text-ink">安全设置</h3>
            <div v-for="s in [
              { label: '登录密码', desc: '上次修改于 2026-08-12', action: '修改密码' },
              { label: '绑定邮箱', desc: 'lin***@talkhub.cn', action: '更换邮箱' },
              { label: '两步验证', desc: '未开启，建议开启提升安全性', action: '立即开启' },
            ]" :key="s.label" class="flex items-center gap-4 py-3 border-b border-line last:border-0">
              <div class="flex-1"><p class="text-[14px] font-semibold text-ink">{{ s.label }}</p><p class="text-[12.5px] text-muted">{{ s.desc }}</p></div>
              <button class="btn btn-secondary btn-sm" @click="toast.info('演示模式')">{{ s.action }}</button>
            </div>
          </template>
          <template v-else>
            <h3 class="text-[16px] font-bold text-ink">通知设置</h3>
            <div v-for="n in [
              { label: '评论与回复', on: true },
              { label: '点赞与收藏', on: true },
              { label: '新关注提醒', on: true },
              { label: '系统公告', on: false },
              { label: '邮件通知', on: false },
            ]" :key="n.label" class="flex items-center justify-between py-3 border-b border-line last:border-0">
              <span class="text-[14px] text-body">{{ n.label }}</span>
              <button
                class="w-11 h-6 rounded-full transition-colors relative"
                :class="n.on ? 'bg-brand' : 'bg-line'"
                :aria-label="n.label + '开关'"
                @click="toast.info('演示模式：开关状态仅本地生效')"
              >
                <span class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" :class="n.on ? 'left-[22px]' : 'left-0.5'" />
              </button>
            </div>
          </template>
        </div>
      </template>

      <!-- 其他占位分区 -->
      <template v-else>
        <EmptyState icon="star" :title="menu.find((m) => m.key === tab)?.label + '暂无内容'" description="内容会随着你的使用逐渐丰富" action-text="去逛逛" @action="navigateTo('/discover')" />
      </template>
    </div>
  </div>
</template>
