<script setup lang="ts">
const props = defineProps<{ badge: 'top' | 'essence' | 'hot' | 'vote' | 'notice' }>()
const map = {
  top: { cls: 'pill pill-top', label: '置顶' },
  essence: { cls: 'pill pill-essence', label: '精华' },
  hot: { cls: 'pill pill-hot', label: '热门' },
  vote: { cls: 'pill pill-vote', label: '投票' },
  notice: { cls: 'pill pill-notice', label: '公告' },
}
</script>

<template>
  <span :class="map[badge].cls">{{ map[badge].label }}</span>
</template>
