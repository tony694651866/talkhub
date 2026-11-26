<script setup lang="ts">
import { ArrowLeft, Save, Eye, Send, Bold, Italic, Quote, Code, Link, List, Strikethrough, Heading2, ListOrdered, Undo2, ImagePlus, X, LoaderCircle, Check } from 'lucide-vue-next'
import { getCurrentUser, getForumList, publishPost } from '~/services/api'

useSiteSeo({
  title: '发布帖子 · TalkHub',
  description: '在 TalkHub 发布帖子，与同好分享你的想法。',
  noindex: true,
})

const router = useRouter()
const toast = useToast()

// 当前登录用户（Mock 会话）：通过 /api/users/me 请求获取
const { data: meData } = await useAsyncData('current-user', () => getCurrentUser())
const currentUser = computed(() => meData.value!)

const forumList = ref<{ slug: string; name: string }[]>([])
const forumSlug = ref('')
const title = ref('')
const body = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const allowComment = ref('所有人')
const publishType = ref('普通')
const previewMode = ref(false)

const draftStatus = ref<'none' | 'saving' | 'saved'>('none')
let draftTimer: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  const list = await getForumList()
  forumList.value = list.map((f) => ({ slug: f.slug, name: f.name }))
})

watch([title, body, forumSlug], () => {
  if (!title.value && !body.value) { draftStatus.value = 'none'; return }
  draftStatus.value = 'saving'
  if (draftTimer) clearTimeout(draftTimer)
  draftTimer = setTimeout(() => (draftStatus.value = 'saved'), 900)
})

// ---------- 工具栏 ----------
const textareaRef = ref<HTMLTextAreaElement>()
const insert = (before: string, after = '', placeholder = '') => {
  const el = textareaRef.value
  if (!el) return
  const start = el.selectionStart, end = el.selectionEnd
  const selected = body.value.slice(start, end) || placeholder
  body.value = body.value.slice(0, start) + before + selected + after + body.value.slice(end)
  nextTick(() => {
    el.focus()
    el.selectionStart = el.selectionEnd = start + before.length + selected.length + after.length
  })
}
const toolbar = [
  { icon: Heading2, title: '标题', run: () => insert('\n## ', '', '标题') },
  { icon: Bold, title: '粗体', run: () => insert('**', '**', '粗体文本') },
  { icon: Italic, title: '斜体', run: () => insert('*', '*', '斜体文本') },
  { icon: Strikethrough, title: '删除线', run: () => insert('~~', '~~', '删除文本') },
  { icon: Link, title: '链接', run: () => insert('[', '](https://)', '链接文字') },
  { icon: Quote, title: '引用', run: () => insert('\n> ', '', '引用内容') },
  { icon: Code, title: '代码块', run: () => insert('\n```\n', '\n```\n', 'const hello = "world"') },
  { icon: List, title: '无序列表', run: () => insert('\n- ', '', '列表项') },
  { icon: ListOrdered, title: '有序列表', run: () => insert('\n1. ', '', '列表项') },
  { icon: Undo2, title: '撤销', run: () => document.execCommand('undo') },
]

// ---------- 图片上传（模拟） ----------
interface UploadItem { id: number; name: string; progress: number; status: 'uploading' | 'done' | 'error'; colors: [string, string] }
const uploads = ref<UploadItem[]>([])
let uid = 0
const imgInput = ref<HTMLInputElement>()
const palette: [string, string][] = [['#5865e8', '#8b5cf6'], ['#f07848', '#f43f5e'], ['#14b8a6', '#0ea5e9'], ['#e9a23b', '#f97316']]

const onPickImages = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  const n = Math.min(files?.length ?? 1, 3 - uploads.value.length)
  for (let i = 0; i < n; i++) {
    const item: UploadItem = { id: ++uid, name: `image_${uid}.webp`, progress: 0, status: 'uploading', colors: palette[uid % palette.length]! }
    uploads.value.push(item)
    const tick = () => {
      item.progress += Math.random() * 34 + 12
      if (item.progress >= 100) { item.progress = 100; item.status = 'done' }
      else setTimeout(tick, 180)
    }
    setTimeout(tick, 200)
  }
  ;(e.target as HTMLInputElement).value = ''
}
const removeUpload = (id: number) => (uploads.value = uploads.value.filter((u) => u.id !== id))
const retryUpload = (item: UploadItem) => {
  item.status = 'uploading'; item.progress = 0
  const tick = () => {
    item.progress += 40
    if (item.progress >= 100) { item.progress = 100; item.status = 'done' } else setTimeout(tick, 150)
  }
  tick()
}

// ---------- 标签 ----------
const addTag = () => {
  const t = tagInput.value.trim().replace(/^#/, '')
  if (t && !tags.value.includes(t) && tags.value.length < 4) tags.value.push(t)
  tagInput.value = ''
}

// ---------- 发布 ----------
const publishing = ref(false)
const canPublish = computed(() => forumSlug.value && title.value.trim().length >= 5 && body.value.trim())
const onPublish = async () => {
  if (!forumSlug.value) { toast.warning('请先选择要发布到的吧'); return }
  if (title.value.trim().length < 5) { toast.warning('标题至少 5 个字'); return }
  publishing.value = true
  const r = await publishPost({ title: title.value, forumSlug: forumSlug.value, content: body.value })
  publishing.value = false
  toast.success('发布成功，即将跳转')
  setTimeout(() => router.push('/me?tab=posts'), 800)
}

// 预览渲染（简易 markdown）
const previewBlocks = computed(() => {
  return body.value.split('\n').filter((l) => l.trim()).map((line) => {
    if (line.startsWith('## ')) return { t: 'h2', text: line.slice(3) }
    if (line.startsWith('> ')) return { t: 'quote', text: line.slice(2) }
    if (/^[-*] /.test(line)) return { t: 'li', text: line.slice(2) }
    if (line.startsWith('```')) return { t: 'skip', text: '' }
    return { t: 'p', text: line }
  }).filter((b) => b.t !== 'skip')
})

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (title.value || body.value) { e.preventDefault(); e.returnValue = '' }
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <div class="container-site max-w-[960px]">
    <!-- 顶部操作栏 -->
    <div class="sticky top-[60px] lg:top-[68px] z-30 card px-4 py-2.5 flex items-center gap-2 mb-4">
      <NuxtLink to="/" class="btn btn-ghost !px-2" aria-label="返回"><ArrowLeft :size="18" /></NuxtLink>
      <h1 class="text-[16px] font-bold text-ink hidden sm:block">发布帖子</h1>
      <span class="ml-2 text-[12.5px] flex items-center gap-1.5" :class="draftStatus === 'saved' ? 'text-success' : 'text-muted'">
        <template v-if="draftStatus === 'saving'"><LoaderCircle :size="13" class="animate-spin" /> 保存草稿中…</template>
        <template v-else-if="draftStatus === 'saved'"><Check :size="13" /> 草稿已自动保存</template>
      </span>
      <div class="ml-auto flex items-center gap-2">
        <button class="btn btn-secondary btn-sm" @click="previewMode = !previewMode"><Eye :size="14" /> {{ previewMode ? '继续编辑' : '预览' }}</button>
        <button class="btn btn-secondary btn-sm" @click="toast.success('草稿已保存')"><Save :size="14" /> 保存</button>
        <button class="btn btn-primary btn-sm" :disabled="!canPublish || publishing" @click="onPublish">
          <Send v-if="!publishing" :size="14" />
          <span v-else class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          {{ publishing ? '发布中' : '发布' }}
        </button>
      </div>
    </div>

    <div v-if="!previewMode" class="card p-5 sm:p-7 space-y-5">
      <!-- 选择吧 + 标题 -->
      <div>
        <label class="text-[13.5px] font-semibold text-ink block mb-1.5">发布到哪个吧 <span class="text-danger">*</span></label>
        <select v-model="forumSlug" class="input">
          <option value="" disabled>选择一个吧</option>
          <option v-for="f in forumList" :key="f.slug" :value="f.slug">{{ f.name }}</option>
        </select>
      </div>
      <div>
        <label class="text-[13.5px] font-semibold text-ink block mb-1.5">标题 <span class="text-danger">*</span> <span class="text-muted font-normal ml-1">{{ title.length }}/80</span></label>
        <input v-model="title" class="input !h-12 !text-[16px]" maxlength="80" placeholder="请输入帖子标题（5-80 字）">
      </div>

      <!-- 编辑器 -->
      <div>
        <label class="text-[13.5px] font-semibold text-ink block mb-1.5">正文</label>
        <div class="border border-line rounded-[12px] overflow-hidden focus-within:border-brand transition-colors">
          <!-- 工具栏 -->
          <div class="flex items-center gap-0.5 px-2.5 py-2 border-b border-line bg-surface-soft overflow-x-auto no-scrollbar" role="toolbar" aria-label="编辑工具栏">
            <button v-for="t in toolbar" :key="t.title" class="btn btn-ghost !h-8 !w-8 !px-0 flex-none" :title="t.title" :aria-label="t.title" @click="t.run()">
              <component :is="t.icon" :size="16" />
            </button>
          </div>
          <textarea
            ref="textareaRef"
            v-model="body"
            class="w-full min-h-[420px] p-4 outline-none resize-y text-[15px] leading-[1.85] text-body placeholder:text-muted"
            placeholder="开始创作……支持 Markdown 语法：## 标题、**粗体**、> 引用、- 列表"
          />
        </div>
      </div>

      <!-- 图片上传 -->
      <div>
        <label class="text-[13.5px] font-semibold text-ink block mb-2">图片附件（最多 3 张）</label>
        <div class="flex flex-wrap gap-3">
          <div v-for="u in uploads" :key="u.id" class="relative">
            <div class="cover-grad relative w-[96px] h-[96px] rounded-[8px] overflow-hidden" :style="{ background: `linear-gradient(135deg, ${u.colors[0]}, ${u.colors[1]})`, opacity: u.status === 'uploading' ? 0.55 : 1 }">
              <span v-if="u.status === 'uploading'" class="absolute inset-0 flex items-center justify-center text-white text-[12px] font-bold">{{ Math.round(u.progress) }}%</span>
            </div>
            <div class="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-black/25 overflow-hidden"><div class="h-full bg-white transition-all" :style="{ width: u.progress + '%' }" /></div>
            <button class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center hover:bg-danger transition-colors" :aria-label="'删除 ' + u.name" @click="removeUpload(u.id)"><X :size="12" /></button>
            <p class="mt-2 w-[96px] text-[11px] text-muted truncate text-center">{{ u.name }}</p>
            <button v-if="u.status === 'error'" class="text-[11px] text-brand" @click="retryUpload(u)">重试</button>
          </div>
          <button v-if="uploads.length < 3" class="w-[96px] h-[96px] rounded-[8px] border-2 border-dashed border-line text-muted hover:border-brand hover:text-brand transition-colors flex flex-col items-center justify-center gap-1.5" @click="imgInput?.click()">
            <ImagePlus :size="20" /><span class="text-[11.5px]">添加图片</span>
          </button>
          <input ref="imgInput" type="file" accept="image/*" multiple class="hidden" @change="onPickImages">
        </div>
      </div>

      <!-- 发布设置 -->
      <div class="grid sm:grid-cols-3 gap-4 pt-2 border-t border-line">
        <div>
          <label class="text-[13px] font-semibold text-ink block mb-1.5">帖子类型</label>
          <select v-model="publishType" class="input !h-9"><option>普通</option><option>图文</option><option>投票</option></select>
        </div>
        <div>
          <label class="text-[13px] font-semibold text-ink block mb-1.5">评论权限</label>
          <select v-model="allowComment" class="input !h-9"><option>所有人</option><option>仅吧成员</option><option>关闭评论</option></select>
        </div>
        <div>
          <label class="text-[13px] font-semibold text-ink block mb-1.5">话题标签</label>
          <input v-model="tagInput" class="input !h-9" placeholder="输入后回车添加，最多 4 个" @keydown.enter.prevent="addTag">
          <div v-if="tags.length" class="flex gap-1.5 mt-2 flex-wrap">
            <button v-for="t in tags" :key="t" class="pill pill-brand cursor-pointer" @click="tags = tags.filter((x) => x !== t)"># {{ t }} <X :size="11" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-else class="card p-5 sm:p-8">
      <p class="pill pill-brand mb-3">预览 · 与正式详情页排版一致</p>
      <h1 class="text-[24px] font-bold text-ink leading-snug">{{ title || '（暂无标题）' }}</h1>
      <div class="mt-2 flex items-center gap-2.5">
        <UserAvatar :name="currentUser.nickname" :colors="currentUser.avatarColors" :size="34" />
        <span class="text-[13.5px] font-semibold text-ink">{{ currentUser.nickname }}</span>
        <span class="text-[12.5px] text-muted">刚刚</span>
      </div>
      <div class="prose-post mt-6">
        <template v-for="(b, i) in previewBlocks" :key="i">
          <p v-if="b.t === 'p'">{{ b.text }}</p>
          <h2 v-else-if="b.t === 'h2'">{{ b.text }}</h2>
          <blockquote v-else-if="b.t === 'quote'">{{ b.text }}</blockquote>
          <li v-else-if="b.t === 'li'" class="list-disc ml-6">{{ b.text }}</li>
        </template>
        <p v-if="!body" class="text-muted">（正文为空）</p>
      </div>
    </div>
  </div>
</template>
