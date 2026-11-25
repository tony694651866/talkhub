<script setup lang="ts">
import { NuxtLayout, NuxtPage } from '#components'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ToastHost />
    <ConfirmDialog />
  </div>
</template>
