<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  colors: [string, string]
  size?: number
}>(), { size: 34 })

const bg = computed(() => `linear-gradient(135deg, ${props.colors[0]}, ${props.colors[1]})`)
</script>

<template>
  <span
    class="avatar"
    :style="{ width: size + 'px', height: size + 'px', background: bg, fontSize: size * 0.42 + 'px', boxShadow: '0 2px 8px rgba(30,40,80,.14)' }"
    :aria-label="name + ' 的头像'"
  >{{ name.slice(0, 1) }}</span>
</template>
