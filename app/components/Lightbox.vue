<script setup lang="ts">
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  images: { colors: [string, string]; alt: string }[]
  index: number
}>()
const emit = defineEmits<{ close: []; update: [index: number] }>()

const prev = () => emit('update', (props.index - 1 + props.images.length) % props.images.length)
const next = () => emit('update', (props.index + 1) % props.images.length)

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div class="fixed inset-0 z-[85] bg-black/85 flex items-center justify-center" @click.self="emit('close')">
        <button class="absolute top-4 right-4 text-white/80 hover:text-white p-2" aria-label="关闭灯箱" @click="emit('close')"><X :size="26" /></button>
        <div class="relative w-full max-w-[860px] px-4">
          <div
            class="cover-grad relative w-full aspect-[16/9] rounded-[16px] flex items-center justify-center transition-all duration-300"
            :style="{ background: `linear-gradient(135deg, ${images[index]!.colors[0]}, ${images[index]!.colors[1]})` }"
          >
            <span class="text-white/90 text-lg font-medium">{{ images[index]!.alt }}</span>
          </div>
          <div v-if="images.length > 1">
            <button class="absolute left-2 top-1/2 -translate-y-1/2 text-white/75 hover:text-white bg-black/30 rounded-full p-2" aria-label="上一张" @click="prev"><ChevronLeft :size="24" /></button>
            <button class="absolute right-2 top-1/2 -translate-y-1/2 text-white/75 hover:text-white bg-black/30 rounded-full p-2" aria-label="下一张" @click="next"><ChevronRight :size="24" /></button>
          </div>
          <p class="text-center text-white/60 text-[13px] mt-3">{{ index + 1 }} / {{ images.length }} · {{ images[index]!.alt }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
