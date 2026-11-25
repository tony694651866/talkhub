<script setup lang="ts">
// 帖子缩略图：单图 16:9 / 双图 4:3 / 三图方图 +N，点击打开灯箱
const props = defineProps<{
  images: { colors: [string, string]; alt: string }[]
}>()

const emit = defineEmits<{ open: [index: number] }>()

const shown = computed(() => props.images.slice(0, 3))
const extra = computed(() => Math.max(0, props.images.length - 3))
const ratioClass = computed(() => {
  if (shown.value.length === 1) return 'aspect-[16/9] max-w-[300px]'
  if (shown.value.length === 2) return 'aspect-[4/3]'
  return 'aspect-square'
})
</script>

<template>
  <div class="mt-3 flex gap-1.5" @click.stop>
    <button
      v-for="(img, i) in shown"
      :key="i"
      class="relative overflow-hidden rounded-[9px] flex-1 min-w-0 group focus-visible:outline-2"
      :class="ratioClass"
      :aria-label="'查看图片：' + img.alt"
      @click.stop="emit('open', i)"
    >
      <span
        class="cover-grad absolute inset-0 transition-transform duration-300 group-hover:scale-[1.04]"
        :style="{ background: `linear-gradient(135deg, ${img.colors[0]}, ${img.colors[1]})` }"
      >
        <span class="absolute inset-0 flex items-center justify-center text-white/85 text-[11px] font-medium tracking-wider">{{ img.alt }}</span>
      </span>
      <span v-if="i === 2 && extra > 0" class="absolute inset-0 bg-black/45 text-white text-[15px] font-bold flex items-center justify-center">+{{ extra }}</span>
    </button>
  </div>
</template>
