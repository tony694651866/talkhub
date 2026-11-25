<script setup lang="ts">
import { ThumbsUp, CornerDownRight } from 'lucide-vue-next'
import type { Comment } from '~/../shared/types'

const props = defineProps<{
  comment: Comment
  isSub?: boolean
}>()

const emit = defineEmits<{ reply: [target: string] }>()

const { isCommentLiked, toggleCommentLike } = useInteraction()
const beating = ref(false)
const toast = useToast()

const showAllReplies = ref(false)
const visibleReplies = computed(() =>
  showAllReplies.value ? props.comment.replies : props.comment.replies.slice(0, 2),
)

const onLike = () => {
  toggleCommentLike(props.comment)
  beating.value = true
  setTimeout(() => (beating.value = false), 420)
}
const onReply = () => {
  emit('reply', props.comment.authorNickname)
  toast.info('在下方输入框回复 @' + props.comment.authorNickname)
}
</script>

<template>
  <div class="flex gap-3" :class="isSub ? 'py-2.5' : 'py-4 border-b border-line last:border-0'">
    <UserAvatar :name="comment.authorNickname" :colors="comment.authorColors" :size="isSub ? 26 : 34" />
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-[13.5px] font-semibold text-ink">{{ comment.authorNickname }}</span>
        <span class="text-[12px] text-muted">{{ comment.createdAt }}</span>
      </div>
      <p class="mt-1 text-[14px] text-body leading-relaxed break-words">{{ comment.content }}</p>
      <div class="mt-2 flex items-center gap-1">
        <button
          class="btn btn-ghost !h-7 !px-1.5 text-[12.5px] gap-1"
          :class="{ '!text-brand': isCommentLiked(comment.id) }"
          @click="onLike"
        >
          <ThumbsUp :size="13" :class="{ 'heart-beat': beating, 'fill-current': isCommentLiked(comment.id) }" />
          {{ comment.likeCount }}
        </button>
        <button class="btn btn-ghost !h-7 !px-1.5 text-[12.5px] gap-1" @click="onReply">
          <CornerDownRight :size="13" /> 回复
        </button>
      </div>

      <!-- 二级回复 -->
      <div v-if="comment.replies.length" class="mt-1.5 pl-4 sm:pl-6 border-l-2 border-line bg-surface-soft/60 rounded-[10px] rounded-tl-none">
        <CommentItem
          v-for="r in visibleReplies"
          :key="r.id"
          :comment="r"
          is-sub
          @reply="emit('reply', $event)"
        />
        <button
          v-if="!showAllReplies && comment.replies.length > visibleReplies.length"
          class="text-[12.5px] text-brand font-medium mb-2.5 hover:underline"
          @click="showAllReplies = true"
        >展开更多回复（{{ comment.replies.length - visibleReplies.length }}）</button>
      </div>
    </div>
  </div>
</template>
