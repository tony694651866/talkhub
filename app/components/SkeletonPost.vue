<script setup lang="ts">
const props = withDefaults(defineProps<{ badges?: string[] }>(), { badges: () => [] })
</script>

<template>
  <div class="card p-[18px] space-y-3" aria-hidden="true">
    <div class="flex items-center gap-2.5">
      <div class="skeleton w-[34px] h-[34px] rounded-full" />
      <div class="skeleton h-3.5 w-32" />
    </div>
    <div class="skeleton h-5 w-3/4" />
    <div class="skeleton h-3.5 w-full" />
    <div class="skeleton h-3.5 w-2/3" />
    <div class="flex gap-2 pt-1">
      <div class="skeleton h-3.5 w-16" />
      <div class="skeleton h-3.5 w-16" />
    </div>
  </div>
</template>
