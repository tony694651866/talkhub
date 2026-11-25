<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

useSiteSeo({
  title: '出错了 · TalkHub',
  description: '页面加载失败。',
  noindex: true,
})

const props = defineProps({
  error: { type: Object, default: null },
})

const meta = computed(() => {
  const code = props.error?.statusCode
  if (code === 403) return { icon: '🔒', title: '无权限访问', desc: '你还没有权限查看这个页面，可能需要登录或申请相应角色。' }
  if (code === 404) return { icon: '🔍', title: '页面不存在', desc: '内容可能已被删除，或者链接地址有误。' }
  return { icon: '⚠️', title: '出了点问题', desc: '页面加载失败，可以稍后重试。' }
})

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="card max-w-[420px] w-full p-10 text-center">
      <div class="text-[44px]">{{ meta.icon }}</div>
      <p class="mt-3 text-[30px] font-extrabold text-ink">{{ error?.statusCode ?? 500 }}</p>
      <h1 class="mt-1 text-[17px] font-bold text-ink">{{ meta.title }}</h1>
      <p class="mt-2 text-[13.5px] text-secondary">{{ meta.desc }}</p>
      <button class="btn btn-primary mt-6" @click="goHome"><ArrowLeft :size="16" /> 返回首页</button>
    </div>
  </div>
</template>
