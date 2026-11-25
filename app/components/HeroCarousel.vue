<script setup lang="ts">
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'
import type { HeroSlide } from '~/../shared/types'

const props = defineProps<{ slides: HeroSlide[] }>()

const current = ref(0)
const paused = ref(false)
const reduced = ref(false)

const INTERVAL = 5500
let timer: ReturnType<typeof setInterval> | null = null

const go = (i: number) => {
  current.value = (i + props.slides.length) % props.slides.length
  restart()
}
const next = () => go(current.value + 1)
const prev = () => go(current.value - 1)

const restart = () => {
  if (timer) clearInterval(timer)
  if (paused.value || reduced.value) return
  timer = setInterval(() => {
    current.value = (current.value + 1) % props.slides.length
  }, INTERVAL)
}

const setPause = (v: boolean) => {
  paused.value = v
  if (v) { if (timer) clearInterval(timer); timer = null } else restart()
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  restart()
})
onUnmounted(() => { if (timer) clearInterval(timer) })

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

const slide = computed(() => props.slides[current.value]!)
</script>

<template>
  <section
    class="relative rounded-[14px] sm:rounded-[20px] overflow-hidden h-[210px] sm:h-[260px] lg:h-[300px] select-none"
    role="region"
    aria-roledescription="轮播"
    aria-label="首页推荐"
    tabindex="0"
    @mouseenter="setPause(true)"
    @mouseleave="setPause(false)"
    @focusin="setPause(true)"
    @focusout="setPause(false)"
    @keydown="onKey"
  >
    <!-- 背景 -->
    <Transition name="fade-in" mode="out-in">
      <div
        :key="slide.id"
        class="absolute inset-0 cover-grad"
        :style="{ background: `linear-gradient(118deg, ${slide.colors[0]}, ${slide.colors[1]})` }"
      >
        <!-- 模糊光斑装饰 -->
        <span class="absolute -right-16 -top-24 w-72 h-72 rounded-full opacity-25" style="background: radial-gradient(circle, #fff 0%, transparent 65%); filter: blur(40px)" />
        <span class="absolute right-40 bottom-[-70px] w-56 h-56 rounded-full opacity-20" style="background: radial-gradient(circle, #fff 0%, transparent 60%); filter: blur(46px)" />
        <!-- 网点纹理 -->
        <span class="absolute right-6 top-6 w-40 h-40 opacity-[0.12]" :style="{ backgroundImage: 'radial-gradient(#fff 1.4px, transparent 1.4px)', backgroundSize: '14px 14px' }" />
      </div>
    </Transition>

    <!-- 文字内容 -->
    <div class="relative h-full flex items-center">
      <Transition name="fade-in" mode="out-in">
        <div :key="slide.id" class="px-7 sm:px-10 lg:px-12 max-w-[600px]">
          <span class="pill bg-white/20 text-white backdrop-blur-sm !h-[24px] !px-3">{{ slide.eyebrow }}</span>
          <h2 class="mt-3 text-white text-[22px] sm:text-[26px] lg:text-[30px] font-bold leading-[1.3] line-clamp-2 rise-in">{{ slide.title }}</h2>
          <p class="mt-2 text-white/85 text-[13px] sm:text-[14px] leading-relaxed line-clamp-2">{{ slide.description }}</p>
          <div class="mt-3 hidden sm:flex items-center gap-2 flex-wrap">
            <span v-for="t in slide.tags.slice(0, 3)" :key="t" class="pill bg-white/14 text-white/90 !h-[22px]"># {{ t }}</span>
          </div>
          <div class="mt-4 flex items-center gap-2.5">
            <NuxtLink :to="slide.actionUrl" class="btn !bg-white !text-ink !h-[38px] !px-4 shadow-md hover:!bg-white/90">{{ slide.actionText }}</NuxtLink>
            <NuxtLink v-if="slide.secondaryActionText" :to="slide.secondaryActionUrl!" class="btn text-white border border-white/40 !h-[38px] !px-4 hover:bg-white/10">{{ slide.secondaryActionText }}</NuxtLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 桌面缩略图导航 -->
    <div class="absolute right-8 bottom-8 hidden lg:flex gap-2.5">
      <button
        v-for="(s, i) in slides"
        :key="s.id"
        class="relative rounded-[8px] overflow-hidden transition-all duration-200 focus-visible:outline-2"
        :class="i === current ? 'w-[104px] h-[62px]' : 'w-[88px] h-[54px] opacity-70 hover:opacity-90'"
        :aria-label="'切换到第 ' + (i + 1) + ' 张'"
        @click="go(i)"
      >
        <span class="absolute inset-0" :style="{ background: `linear-gradient(135deg, ${s.thumbColors[0]}, ${s.thumbColors[1]})` }" />
        <span
          class="absolute inset-0 rounded-[8px] transition-all duration-200"
          :class="i === current ? 'ring-2 ring-white' : 'ring-0'"
        />
      </button>
    </div>

    <!-- 左右箭头 -->
    <button class="carousel-arrow left-3" aria-label="上一张" @click="prev"><ChevronLeft :size="20" /></button>
    <button class="carousel-arrow right-3" aria-label="下一张" @click="next"><ChevronRight :size="20" /></button>

    <!-- 暂停/播放 + 圆点 -->
    <div class="absolute left-7 sm:left-10 lg:left-12 bottom-4 flex items-center gap-3">
      <button
        class="text-white/75 hover:text-white transition-colors"
        :aria-label="paused ? '继续自动轮播' : '暂停自动轮播'"
        @click="setPause(!paused)"
      >
        <Pause v-if="!paused" :size="15" />
        <Play v-else :size="15" />
      </button>
      <div class="flex items-center gap-1.5 lg:hidden">
        <button
          v-for="(s, i) in slides"
          :key="s.id"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'"
          :aria-label="'切换到第 ' + (i + 1) + ' 张'"
          @click="go(i)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.18);
  border-radius: 999px;
  padding: 7px;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.15s ease;
}
section:hover .carousel-arrow { opacity: 1; }
@media (hover: none) { .carousel-arrow { opacity: 0.75; } }
.carousel-arrow:hover { background: rgba(0, 0, 0, 0.34); color: #fff; }
</style>
