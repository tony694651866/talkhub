<script setup lang="ts">
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

export interface ToastItem {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
}

const { toasts, remove } = useToast()

const icons = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info }
const styles: Record<string, string> = {
  success: 'color:#20a779',
  error: 'color:#e45c69',
  warning: 'color:#e9a23b',
  info: 'color:#5865e8',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed z-[90] top-4 right-4 left-4 sm:left-auto flex flex-col gap-2.5 items-end pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-center gap-2.5 bg-white border border-line rounded-[12px] px-4 py-3 shadow-[0_10px_30px_rgba(24,30,60,.14)] min-w-[220px] max-w-[92vw] sm:max-w-[380px]"
          role="status"
        >
          <component :is="icons[t.type]" :size="19" :style="styles[t.type]" />
          <span class="text-[13.5px] text-ink flex-1">{{ t.text }}</span>
          <button class="text-muted hover:text-ink transition-colors" aria-label="关闭提示" @click="remove(t.id)">
            <X :size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
