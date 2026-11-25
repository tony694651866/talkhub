<script setup lang="ts">
import { Users, Zap, FileText, MessageSquare, ShieldAlert, Flag, ArrowUpRight, Check, X, EyeOff, Coffee } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useSiteSeo({
  title: '运营后台 · TalkHub',
  description: 'TalkHub 运营管理与内容审核后台。',
  noindex: true,
})

const toast = useToast()
const { state, confirm } = useConfirm()

const stats = [
  { label: '注册用户', value: 684200, delta: '+2.4%', icon: Users },
  { label: '日活跃用户', value: 52300, delta: '+5.1%', icon: Zap },
  { label: '今日发帖', value: 3184, delta: '+1.2%', icon: FileText },
  { label: '今日评论', value: 12760, delta: '+3.8%', icon: MessageSquare },
  { label: '待审核内容', value: 24, delta: '-6', warn: true, icon: ShieldAlert },
  { label: '未处理举报', value: 9, delta: '+2', warn: true, icon: Flag },
]

const reviewQueue = [
  { id: 'r1', type: '帖子', title: '新入坑玩家求指路（含外链）', forum: '游戏研究所', reason: '疑似广告链接' },
  { id: 'r2', type: '评论', title: '「这游戏做这么烂还有脸收费…」', forum: '光影放映室', reason: '人身攻击' },
  { id: 'r3', type: '帖子', title: '内部资料分享（附件 PDF）', forum: '自习室夜灯', reason: '疑似侵权资源' },
]

const trend = [30, 42, 38, 56, 48, 66, 72]

const onReview = async (item: typeof reviewQueue[0], action: '通过' | '拒绝' | '隐藏') => {
  if (action !== '通过') {
    const ok = await confirm({ title: `${action}该内容？`, description: `「${item.title.slice(0, 16)}…」需要选择原因并记录审计日志。`, confirmText: `确认${action}`, danger: true })
    if (!ok) return
  }
  toast.success(`已${action}「${item.type}」，操作已记录`)
}
</script>

<template>
  <div class="container-site space-y-5">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <div v-for="s in stats" :key="s.label" class="card p-4 card-hover">
        <div class="flex items-center justify-between">
          <span class="w-8 h-8 rounded-[9px] flex items-center justify-center" :class="s.warn ? 'bg-[#e9a23b1a] text-warning' : 'bg-brand-soft text-brand'">
            <component :is="s.icon" :size="16" />
          </span>
          <span class="text-[11.5px] font-semibold" :class="s.delta.startsWith('+') ? (s.warn ? 'text-danger' : 'text-success') : 'text-success'">{{ s.delta }}</span>
        </div>
        <p class="mt-3 text-[20px] font-bold text-ink">{{ formatCount(s.value) }}</p>
        <p class="text-[12px] text-muted">{{ s.label }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-start">
      <!-- 趋势图 -->
      <div class="card p-5">
        <h3 class="text-[15px] font-bold text-ink mb-1">近 7 天活跃趋势</h3>
        <p class="text-[12px] text-muted mb-4">发帖量 · 评论量 · 活跃用户（相对指数）</p>
        <svg viewBox="0 0 520 160" class="w-full" role="img" aria-label="活跃趋势图">
          <g>
            <rect v-for="(v, i) in trend" :key="i" :x="30 + i * 70" :y="150 - v * 1.7" width="34" :height="v * 1.7" rx="7" fill="url(#adminGrad)" />
            <defs>
              <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#5865e8" />
                <stop offset="1" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>
            <g fill="#a0a7b6" font-size="11" text-anchor="middle" font-family="sans-serif">
              <text v-for="(d, i) in ['11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09']" :key="d" :x="47 + i * 70" y="168">{{ d }}</text>
            </g>
          </g>
        </svg>
      </div>

      <!-- 快捷入口 -->
      <div class="card p-5">
        <h3 class="text-[15px] font-bold text-ink mb-4">快捷入口</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NuxtLink v-for="q in [
            { label: '审核队列', to: '/admin', icon: ShieldAlert, badge: 24 },
            { label: '用户管理', to: '/admin', icon: Users, badge: 0 },
            { label: '吧管理', to: '/forums', icon: Coffee, badge: 0 },
            { label: '首页运营位', to: '/admin', icon: Zap, badge: 0 },
            { label: '分类标签', to: '/forums', icon: FileText, badge: 0 },
            { label: '日志审计', to: '/admin', icon: Flag, badge: 0 },
          ]" :key="q.label" :to="q.to" class="relative flex flex-col items-center gap-2 py-4 rounded-[12px] border border-line hover:border-brand/40 hover:bg-brand-soft/50 transition-all group">
            <span class="text-brand group-hover:scale-110 transition-transform"><component :is="q.icon" :size="20" /></span>
            <span class="text-[13px] font-medium text-body">{{ q.label }}</span>
            <span v-if="q.badge" class="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10.5px] font-bold flex items-center justify-center">{{ q.badge }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 审核队列 -->
    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-line flex items-center">
        <h3 class="text-[15px] font-bold text-ink">审核队列</h3>
        <span class="pill pill-top ml-2">{{ reviewQueue.length }} 条待处理</span>
        <button class="ml-auto text-[13px] text-brand hover:underline" @click="toast.info('已进入完整审核中心（演示）')">进入审核中心 <ArrowUpRight :size="13" class="inline" /></button>
      </div>
      <div class="divide-y divide-line">
        <div v-for="item in reviewQueue" :key="item.id" class="px-5 py-4 flex items-center gap-3 flex-wrap">
          <span class="pill" :class="item.type === '帖子' ? 'pill-brand' : 'pill-normal'">{{ item.type }}</span>
          <div class="flex-1 min-w-[200px]">
            <p class="text-[14px] font-medium text-ink truncate">{{ item.title }}</p>
            <p class="text-[12.5px] text-muted mt-0.5">{{ item.forum }} · 举报原因：{{ item.reason }}</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-soft btn-sm !text-success !bg-[#20a7791a]" @click="onReview(item, '通过')"><Check :size="13" /> 通过</button>
            <button class="btn btn-soft btn-sm !text-danger !bg-[#e45c691a]" @click="onReview(item, '拒绝')"><X :size="13" /> 拒绝</button>
            <button class="btn btn-soft btn-sm !text-warning !bg-[#e9a23b1a]" @click="onReview(item, '隐藏')"><EyeOff :size="13" /> 隐藏</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
