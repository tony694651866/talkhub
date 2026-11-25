<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 pt-5 pb-[76px] md:pb-14">
      <slot />
    </main>
    <SiteFooter class="hidden md:block" />
    <MobileTabBar />
  </div>
</template>
