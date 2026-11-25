<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  actionText?: string
}>(), { icon: 'message-circle' })

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="card flex flex-col items-center justify-center text-center py-14 px-6 fade-in">
    <span class="w-14 h-14 rounded-full bg-brand-soft text-brand flex items-center justify-center mb-4">
      <AppIcon :name="icon" :size="26" />
    </span>
    <p class="text-[16px] font-bold text-ink">{{ title }}</p>
    <p v-if="description" class="mt-1.5 text-[13.5px] text-secondary max-w-[300px]">{{ description }}</p>
    <button v-if="actionText" class="btn btn-primary btn-sm mt-5" @click="emit('action')">{{ actionText }}</button>
  </div>
</template>
