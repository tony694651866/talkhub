<script setup lang="ts">
// 统一图标入口：按字符串名取 Lucide 图标，保证 Mock 数据里的 icon 字段可用
import {
  Gamepad2, Cpu, Clapperboard, Sparkles, Coffee, MessageCircleHeart, BookOpen,
  Footprints, Camera, Code2, MessageCircle, type LucideIcon,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{ name: string; size?: number; strokeWidth?: number }>(), {
  size: 18,
  strokeWidth: 1.9,
})

const map: Record<string, LucideIcon> = {
  'gamepad-2': Gamepad2,
  'cpu': Cpu,
  'clapperboard': Clapperboard,
  'sparkles': Sparkles,
  'coffee': Coffee,
  'message-circle-heart': MessageCircleHeart,
  'book-open': BookOpen,
  'footprints': Footprints,
  'camera': Camera,
  'code-2': Code2,
  'message-circle': MessageCircle,
}

const icon = computed(() => map[props.name] ?? MessageCircle)
</script>

<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" />
</template>
