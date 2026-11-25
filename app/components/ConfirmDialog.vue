<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
const { state, settle } = useConfirmHost()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[80] bg-[rgba(20,25,40,.42)] flex items-end sm:items-center justify-center p-4"
        @click.self="settle(false)"
      >
        <div class="modal-panel w-full sm:w-[400px] bg-white rounded-[18px] p-6 shadow-[var(--shadow-pop)] pop-in" role="alertdialog" :aria-label="state.options.title">
          <div class="flex items-start gap-3">
            <span
              class="flex-none w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ background: state.options.danger ? '#fdecef' : 'var(--color-brand-soft)' }"
            >
              <AlertTriangle :size="20" :style="{ color: state.options.danger ? 'var(--color-danger)' : 'var(--color-brand)' }" />
            </span>
            <div class="flex-1 min-w-0">
              <h3 class="text-[16px] font-bold text-ink">{{ state.options.title }}</h3>
              <p v-if="state.options.description" class="mt-1.5 text-[13.5px] text-secondary leading-relaxed">{{ state.options.description }}</p>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2.5">
            <button class="btn btn-secondary btn-sm" @click="settle(false)">取消</button>
            <button
              class="btn btn-sm"
              :class="state.options.danger ? 'btn-danger' : 'btn-primary'"
              @click="settle(true)"
            >{{ state.options.confirmText ?? '确认' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
