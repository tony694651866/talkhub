export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  danger?: boolean
}

const state = ref<{ open: boolean; options: ConfirmOptions; resolve?: (v: boolean) => void }>({
  open: false,
  options: { title: '' },
})

export function useConfirm() {
  const confirm = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      state.value = { open: true, options, resolve }
    })
  }
  return { state, confirm }
}

export function useConfirmHost() {
  const { state } = useConfirm()
  const settle = (v: boolean) => {
    state.value.resolve?.(v)
    state.value.open = false
  }
  const onKey = (e: KeyboardEvent) => {
    if (!state.value.open) return
    if (e.key === 'Escape') settle(false)
    if (e.key === 'Enter') settle(true)
  }
  onMounted(() => window.addEventListener('keydown', onKey))
  onUnmounted(() => window.removeEventListener('keydown', onKey))
  return { state, settle }
}
