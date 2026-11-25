<script setup lang="ts">
import { MessageSquare, Eye, ThumbsUp, Star, MoreHorizontal, Link2, Flag as FlagIcon, UserRoundX } from 'lucide-vue-next'
import type { Post } from '~/../shared/types'

const props = defineProps<{ post: Post; showForum?: boolean }>()
const { isLiked, toggleLike, isFav, toggleFav } = useInteraction()
const toast = useToast()
const menuOpen = ref(false)
const menuRef = ref<HTMLElement>()
const beating = ref(false)
const lightbox = ref(-1)

const onClickLike = () => {
  toggleLike(props.post)
  beating.value = true
  setTimeout(() => (beating.value = false), 420)
  toast.success(isLiked(props.post.id) ? '已点赞' : '已取消点赞')
}
const onClickFav = () => {
  toggleFav(props.post)
  toast.success(isFav(props.post.id) ? '已加入收藏' : '已取消收藏')
}
const copyLink = () => {
  navigator.clipboard?.writeText(location.origin + '/p/' + props.post.id).catch(() => {})
  menuOpen.value = false
  toast.success('链接已复制')
}
const report = () => {
  menuOpen.value = false
  toast.info('已收到举报，我们会尽快处理')
}
const blockUser = () => {
  menuOpen.value = false
  toast.success('已屏蔽该用户')
}

const onDocClick = (e: MouseEvent) => {
  if (menuOpen.value && menuRef.value && !menuRef.value.contains(e.target as Node)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <article class="card card-hover p-4 sm:p-[18px] group">
    <!-- 顶部：吧信息 / 作者 -->
    <div class="flex items-center gap-2.5">
      <NuxtLink v-if="showForum !== false" :to="'/f/' + post.forumSlug" class="flex items-center gap-2.5 min-w-0">
        <UserAvatar :name="post.forumName" :colors="post.forumAvatarColors" :size="34" />
        <span class="text-[13.5px] font-semibold text-ink truncate">{{ post.forumName }}</span>
        <span class="text-[12.5px] text-muted truncate">· {{ post.authorNickname }}</span>
      </NuxtLink>
      <NuxtLink v-else :to="'/u/' + post.author" class="flex items-center gap-2.5 min-w-0">
        <UserAvatar :name="post.authorNickname" :colors="post.authorColors" :size="34" />
        <span class="text-[13.5px] font-semibold text-ink truncate">{{ post.authorNickname }}</span>
      </NuxtLink>
      <span class="text-[12.5px] text-muted flex-none">{{ post.createdAt }}</span>
      <div ref="menuRef" class="relative ml-auto flex-none">
        <button class="btn btn-ghost !h-8 !px-2" aria-label="更多操作" @click="menuOpen = !menuOpen">
          <MoreHorizontal :size="17" />
        </button>
        <Transition name="fade-in">
          <div v-if="menuOpen" class="absolute right-0 top-9 w-[180px] bg-white border border-line rounded-[10px] shadow-[0_12px_32px_rgba(24,30,60,.14)] py-1.5 z-20 pop-in">
            <button class="w-full h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-body hover:bg-surface-soft" @click="copyLink">
              <Link2 :size="15" /> 复制链接
            </button>
            <button class="w-full h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-body hover:bg-surface-soft" @click="onClickFav(); menuOpen = false">
              <Star :size="15" /> 收藏
            </button>            <button class="w-full h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-body hover:bg-surface-soft" @click="report">
              <FlagIcon :size="15" /> 举报
            </button>
            <button class="w-full h-[38px] px-4 flex items-center gap-2.5 text-[13.5px] text-danger hover:bg-[#fdecef]" @click="blockUser">
              <UserRoundX :size="15" /> 屏蔽该用户
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 标题 + 标签 -->
    <NuxtLink :to="'/p/' + post.id" class="block mt-3">
      <div class="flex items-center gap-2 flex-wrap">
        <StatusPill v-for="b in post.badges.slice(0, 3)" :key="b" :badge="b" />
        <h2 class="text-[17px] font-semibold text-ink leading-snug line-clamp-2 group-hover:text-brand transition-colors">{{ post.title }}</h2>
      </div>
      <p class="mt-1.5 text-[14px] text-[#667085] leading-relaxed line-clamp-2">{{ post.excerpt }}</p>
    </NuxtLink>

    <!-- 投票预览 -->
    <NuxtLink v-if="post.vote" :to="'/p/' + post.id" class="mt-3 block rounded-[10px] border border-line bg-surface-soft p-3.5">
      <div v-for="opt in post.vote.options.slice(0, 2)" :key="opt.label" class="mb-2 last:mb-0">
        <div class="flex justify-between text-[12.5px] text-secondary mb-1"><span>{{ opt.label }}</span><span>{{ formatCount(opt.count) }} 票</span></div>
        <div class="h-1.5 rounded-full bg-line overflow-hidden">
          <div class="h-full rounded-full bg-brand/60" :style="{ width: (opt.count / post.vote.total * 100) + '%' }" />
        </div>
      </div>
      <p class="text-[12px] text-muted mt-2">{{ post.vote.deadline }} 截止 · {{ formatCount(post.vote.total) }} 人已投</p>
    </NuxtLink>

    <!-- 缩略图 -->
    <ThumbGrid v-if="post.images.length" :images="post.images" @open="lightbox = $event" />

    <!-- 底部互动 -->
    <div class="mt-3.5 flex items-center gap-1 text-[12.5px] text-secondary">
      <button class="btn btn-ghost !h-8 gap-1.5" :class="{ '!text-brand': isLiked(post.id) }" @click="onClickLike">
        <ThumbsUp :size="15" :class="{ 'heart-beat': beating, 'fill-current': isLiked(post.id) }" />
        {{ formatCount(post.likeCount) }}
      </button>
      <NuxtLink :to="'/p/' + post.id" class="btn btn-ghost !h-8 gap-1.5">
        <MessageSquare :size="15" /> {{ formatCount(post.commentCount) }}
      </NuxtLink>
      <span class="btn btn-ghost !h-8 gap-1.5 cursor-default">
        <Eye :size="15" /> {{ formatCount(post.viewCount) }}
      </span>
      <button class="btn btn-ghost !h-8 gap-1.5 ml-auto" :class="{ '!text-warning': isFav(post.id) }" aria-label="收藏" @click="onClickFav">
        <Star :size="15" :class="{ 'fill-current': isFav(post.id) }" />
        <span class="hidden sm:inline">{{ formatCount(post.favoriteCount) }}</span>
      </button>
    </div>

    <Lightbox v-if="lightbox >= 0" :images="post.images" :index="lightbox" @close="lightbox = -1" @update="lightbox = $event" />
  </article>
</template>
