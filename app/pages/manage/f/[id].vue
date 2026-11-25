<script setup lang="ts">
import { LayoutDashboard, Settings, ScrollText, FileText, MessageSquare, Users, ShieldCheck, UserCheck, Ban, History } from 'lucide-vue-next'
import { getForum } from '~/services/api'
import { users } from '~/utils/mock-data'

useSiteSeo({
  title: '吧管理中心 · TalkHub',
  description: '吧务团队管理后台。',
  noindex: true,
})

const route = useRoute()
const forumId = route.params.id as string
const { data: forum } = await useAsyncData(`manage-forum-${forumId}`, () => getForum('game'))
if (!forum.value) throw createError({ statusCode: 403, message: '无权访问该吧管理', fatal: true })

const tab = ref('overview')
const menu = [
  { key: 'overview', label: '概览', icon: LayoutDashboard },
  { key: 'profile', label: '吧资料', icon: Settings },
  { key: 'rules', label: '吧规公告', icon: ScrollText },
  { key: 'posts', label: '帖子管理', icon: FileText },
  { key: 'comments', label: '评论管理', icon: MessageSquare },
  { key: 'members', label: '成员管理', icon: Users },
  { key: 'team', label: '吧务团队', icon: ShieldCheck },
  { key: 'apply', label: '加入申请', icon: UserCheck },
  { key: 'banned', label: '禁言名单', icon: Ban },
  { key: 'logs', label: '操作日志', icon: History },
]

const toast = useToast()
const { state, confirm } = useConfirm()

const postsRows = [
  { title: '【投票】2026 年度游戏大讨论', author: '夜猫子', status: '已发布', time: '11-07 14:20' },
  { title: '像素 Roguelike 开发日志 #14', author: '糖糖不爱糖', status: '已加精', time: '11-07 11:02' },
  { title: '新入坑玩家求指路', author: '新用户_0921', status: '待审核', time: '11-07 09:44' },
  { title: '灌水：大家午休都干嘛', author: '海豹摸鱼中', status: '已隐藏', time: '11-06 22:10' },
]
const members = users.slice(0, 6)

const onBanned = async (name: string) => {
  const ok = await confirm({ title: `禁言 @${name}？`, description: '禁言 3 天，需填写原因并记录日志。', confirmText: '确认禁言', danger: true })
  if (ok) toast.success(`已禁言 @${name}（3 天）`)
}
const onToggle = (s: string) => {
  toast.success(s === '待审核' ? '已通过审核' : '操作已执行并记录日志')
}
</script>

<template>
  <div class="container-site grid lg:grid-cols-[224px_minmax(0,1fr)] gap-5 items-start">
    <!-- 菜单 -->
    <aside class="card p-2.5 lg:sticky lg:top-[76px]">
      <p class="px-3 py-2 text-[12px] text-muted font-medium">{{ forum!.name }} · 管理菜单</p>
      <nav class="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar" aria-label="管理菜单">
        <button v-for="m in menu" :key="m.key" class="flex items-center gap-2.5 h-9 px-3 rounded-[9px] text-[13.5px] font-medium whitespace-nowrap transition-colors" :class="tab === m.key ? 'bg-brand-soft text-brand' : 'text-body hover:bg-surface-soft'" @click="tab = m.key">
          <component :is="m.icon" :size="15" /> {{ m.label }}
        </button>
      </nav>
    </aside>

    <!-- 内容 -->
    <div class="min-w-0 space-y-4">
      <!-- 概览 -->
      <template v-if="tab === 'overview'">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="s in [
            { label: '成员总数', value: forum!.memberCount, warn: false },
            { label: '今日新帖', value: forum!.todayPosts, warn: false },
            { label: '待审核', value: 2, warn: true },
            { label: '举报待处理', value: 1, warn: true },
          ]" :key="s.label" class="card p-4">
            <p class="text-[20px] font-bold" :class="s.warn ? 'text-warning' : 'text-ink'">{{ formatCount(s.value) }}</p>
            <p class="text-[12.5px] text-muted mt-0.5">{{ s.label }}</p>
          </div>
        </div>
        <div class="card p-5">
          <h3 class="text-[15px] font-bold text-ink mb-4">近 7 日发帖趋势</h3>
          <svg viewBox="0 0 520 140" class="w-full h-[140px]" role="img" aria-label="近7日发帖趋势图">
            <polyline
              points="20,110 95,92 170,98 245,64 320,72 395,40 470,52"
              fill="none" stroke="#5865e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
            />
            <polyline points="20,110 95,92 170,98 245,64 320,72 395,40 470,52 470,130 20,130" fill="rgba(88,101,232,.08)" stroke="none" />
            <g v-for="(y, i) in [110, 92, 98, 64, 72, 40, 52]" :key="i">
              <circle :cx="20 + i * 75" :cy="y" r="4.5" fill="#5865e8" />
            </g>
            <g fill="#a0a7b6" font-size="11" text-anchor="middle" font-family="sans-serif">
              <text v-for="(d, i) in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']" :key="d" :x="20 + i * 75" y="135">{{ d }}</text>
            </g>
          </svg>
        </div>
      </template>

      <!-- 帖子管理 -->
      <template v-else-if="tab === 'posts' || tab === 'comments'">
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-line flex items-center gap-3">
            <h3 class="text-[15px] font-bold text-ink">{{ tab === 'posts' ? '帖子管理' : '评论管理' }}</h3>
            <span class="text-[12.5px] text-muted ml-auto">搜索与筛选在真实接入后生效</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-[13.5px] min-w-[560px]">
              <thead>
                <tr class="text-left text-muted border-b border-line bg-surface-soft">
                  <th class="px-5 py-2.5 font-medium">标题</th>
                  <th class="px-4 py-2.5 font-medium">作者</th>
                  <th class="px-4 py-2.5 font-medium">状态</th>
                  <th class="px-4 py-2.5 font-medium">时间</th>
                  <th class="px-4 py-2.5 font-medium">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                <tr v-for="r in postsRows" :key="r.title" class="hover:bg-surface-soft">
                  <td class="px-5 py-3 text-ink font-medium max-w-[280px] truncate">{{ r.title }}</td>
                  <td class="px-4 py-3 text-body">{{ r.author }}</td>
                  <td class="px-4 py-3">
                    <span class="pill" :class="r.status === '待审核' ? 'pill-top' : r.status === '已隐藏' ? 'pill-hot' : 'pill-vote'">{{ r.status }}</span>
                  </td>
                  <td class="px-4 py-3 text-muted">{{ r.time }}</td>
                  <td class="px-4 py-3">
                    <button class="text-brand hover:underline mr-2.5" @click="onToggle(r.status)">通过</button>
                    <button class="text-danger hover:underline" @click="onToggle('隐藏')">隐藏</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- 成员管理 -->
      <template v-else-if="tab === 'members'">
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-line"><h3 class="text-[15px] font-bold text-ink">成员管理</h3></div>
          <div class="divide-y divide-line">
            <div v-for="m in members" :key="m.id" class="px-5 py-3.5 flex items-center gap-3">
              <UserAvatar :name="m.nickname" :colors="m.avatarColors" :size="34" />
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-semibold text-ink">{{ m.nickname }}</p>
                <p class="text-[12px] text-muted">Lv.{{ m.level }} · 加入于 {{ m.joinedAt }}</p>
              </div>
              <button class="btn btn-ghost btn-sm !text-danger" @click="onBanned(m.nickname)">禁言</button>
              <button class="btn btn-ghost btn-sm" @click="toast.info('演示模式：移除需吧主确认')">移除</button>
            </div>
          </div>
        </div>
      </template>

      <!-- 吧资料 -->
      <template v-else-if="tab === 'profile'">
        <div class="card p-6 space-y-4">
          <h3 class="text-[16px] font-bold text-ink">吧资料设置</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="text-[13px] font-semibold text-ink block mb-1.5">吧名称</label><input class="input" :value="forum!.name"></div>
            <div><label class="text-[13px] font-semibold text-ink block mb-1.5">分类</label>
              <select class="input"><option>游戏</option><option>科技</option><option>生活</option></select>
            </div>
            <div class="sm:col-span-2"><label class="text-[13px] font-semibold text-ink block mb-1.5">简介</label><textarea class="input !h-20 !py-2 resize-none" :value="forum!.description" /></div>
            <div><label class="text-[13px] font-semibold text-ink block mb-1.5">加入方式</label>
              <select class="input"><option>自由加入</option><option>申请审核</option></select>
            </div>
            <div><label class="text-[13px] font-semibold text-ink block mb-1.5">发帖规则</label>
              <select class="input"><option>所有成员</option><option>仅吧务</option></select>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="btn btn-primary btn-sm" @click="toast.success('资料已保存（演示）')">保存</button>
            <button class="btn btn-secondary btn-sm" @click="toast.info('已生成预览：前台效果可在吧主页查看')">预览公开端</button>
          </div>
        </div>
      </template>

      <!-- 其他分区 -->
      <template v-else>
        <div class="card p-8 text-center">
          <component :is="menu.find((m) => m.key === tab)?.icon" :size="30" class="text-muted mx-auto" />
          <p class="mt-3 text-[15px] font-bold text-ink">{{ menu.find((m) => m.key === tab)?.label }}</p>
          <p class="mt-1 text-[13px] text-secondary">该模块在接入真实数据后启用完整功能</p>
        </div>
      </template>
    </div>
  </div>
</template>
