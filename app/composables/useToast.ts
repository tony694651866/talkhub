let seed = 0

interface ToastItem {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  const push = (type: ToastItem['type'], text: string) => {
    const id = ++seed
    toasts.value.push({ id, type, text })
    setTimeout(() => remove(id), 2800)
  }
  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }
  return {
    toasts,
    remove,
    success: (t: string) => push('success', t),
    error: (t: string) => push('error', t),
    warning: (t: string) => push('warning', t),
    info: (t: string) => push('info', t),
  }
}
