<script setup lang="ts">
const year = new Date().getFullYear()
const links = ['关于我们', '社区公约', '用户协议', '隐私政策', '帮助中心', '意见反馈']
</script>

<template>
  <footer class="mt-10 border-t border-line bg-white/60">
    <div class="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-muted">
      <p>© {{ year }} TalkHub · 让兴趣有回声</p>
      <nav class="flex items-center gap-4 flex-wrap justify-center" aria-label="页脚导航">
        <a v-for="l in links" :key="l" href="javascript:void(0)" class="hover:text-brand transition-colors">{{ l }}</a>
      </nav>
    </div>
  </footer>
</template>
