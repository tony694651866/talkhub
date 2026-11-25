<script setup lang="ts">
import { Home, Compass, PenSquare, Bell, User } from 'lucide-vue-next'

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
const items = [
  { label: '首页', to: '/', icon: Home },
  { label: '发现', to: '/discover', icon: Compass },
  { label: '发布', to: '/post/create', icon: PenSquare, primary: true },
  { label: '消息', to: '/messages', icon: Bell },
  { label: '我的', to: '/me', icon: User },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)]" aria-label="底部导航">
    <div class="grid grid-cols-5 h-[60px]">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-0.5 transition-colors"
        :class="item.primary ? 'text-white' : isActive(item.to) ? 'text-brand' : 'text-secondary'"
      >
        <template v-if="item.primary">
          <span class="w-9 h-9 -mt-1.5 rounded-full bg-gradient-to-br from-brand to-[#7c3aed] flex items-center justify-center shadow-[0_4px_14px_rgba(88,101,232,.45)]">
            <component :is="item.icon" :size="19" />
          </span>
        </template>
        <template v-else>
          <component :is="item.icon" :size="21" :stroke-width="isActive(item.to) ? 2.2 : 1.8" />
        </template>
        <span class="text-[10px]" :class="item.primary ? 'text-secondary' : ''">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
