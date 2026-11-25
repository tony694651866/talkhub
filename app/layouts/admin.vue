<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-page">
    <!-- 后台工具栏 -->
    <header class="sticky top-0 z-50 h-[56px] bg-white border-b border-line flex items-center px-4 sm:px-6 gap-3">
      <slot name="toolbar-left">
        <NuxtLink to="/" class="btn btn-ghost !px-2" aria-label="返回前台"><ArrowLeft :size="18" /></NuxtLink>
        <span class="relative w-7 h-7 rounded-[8px] bg-gradient-to-br from-brand to-[#7c3aed] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z"/></svg>
        </span>
        <span class="text-[15px] font-bold text-ink">TalkHub 管理后台</span>
        <span class="pill pill-essence ml-1">管理端</span>
      </slot>
      <div class="ml-auto flex items-center gap-3">
        <UserAvatar name="林雾" :colors="['#5865e8', '#8b5cf6']" :size="30" />
      </div>
    </header>
    <main class="flex-1 py-5 pb-[76px] md:pb-8">
      <slot />
    </main>
  </div>
</template>
