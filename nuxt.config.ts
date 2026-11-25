import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import { forums, posts, users } from './app/utils/mock-data'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://talkhub.example.com'

// 私有/后台路由：不进 sitemap、不预渲染、robots 禁止抓取
const privateRoutes = [
  '/me',
  '/messages',
  '/post/create',
  '/manage/**',
  '/admin/**',
]

export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/sitemap', '@nuxtjs/robots'],

  runtimeConfig: {
    public: { siteUrl },
  },

  site: { url: siteUrl, name: 'TalkHub' },

  routeRules: {
    // 公开列表/静态页：SWR 缓存 5 分钟
    '/': { swr: 300 },
    '/forums': { swr: 300 },
    '/discover': { swr: 300 },
    '/rankings': { swr: 300 },
    '/search': { swr: 60, robots: false },
    // 公开详情页：SSG 预渲染
    '/p/**': { prerender: true },
    '/f/**': { prerender: true },
    '/u/**': { prerender: true },
    // 私有页：显式关闭预渲染与索引
    ...Object.fromEntries(privateRoutes.map((route) => [route, { prerender: false, robots: false }])),
    // 全局安全响应头
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-XSS-Protection': '1; mode=block',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  },

  sitemap: {
    // 动态 slug 来自 mock 数据，私有路由由 exclude 过滤
    urls: () => [
      { loc: '/', priority: 1 as const, changefreq: 'daily' as const },
      { loc: '/forums', priority: 0.9 as const, changefreq: 'daily' as const },
      { loc: '/discover', priority: 0.8 as const, changefreq: 'daily' as const },
      { loc: '/rankings', priority: 0.7 as const, changefreq: 'daily' as const },
      ...forums.map((f) => ({ loc: `/f/${f.slug}`, priority: 0.8 as const, changefreq: 'weekly' as const })),
      ...posts.map((p) => ({ loc: `/p/${p.id}`, priority: 0.6 as const, changefreq: 'weekly' as const })),
      ...users.map((u) => ({ loc: `/u/${u.username}`, priority: 0.5 as const, changefreq: 'monthly' as const })),
    ],
    exclude: privateRoutes,
    zeroPrerender: true,
  },

  robots: {
    sitemap: ['/sitemap.xml'],
    disallow: [...privateRoutes, '/search'],
    // robots meta 由 useSiteSeo 统一输出，避免重复标签
    metaTag: false,
  },

  nitro: {
    prerender: {
      // 显式给出动态路由，避免 crawlLinks 抓取 _payload.json 在 Windows 上触发 EPERM
      crawlLinks: false,
      routes: [
        '/',
        ...forums.flatMap((f) => [`/f/${f.slug}`, `/f/${f.slug}/rules`, `/f/${f.slug}/members`]),
        ...posts.map((p) => `/p/${p.id}`),
        ...users.map((u) => `/u/${u.username}`),
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'TalkHub · 兴趣讨论社区',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'TalkHub —— 以兴趣圈子为单位的现代化讨论社区。找到你的吧，加入讨论。' },
        { name: 'theme-color', content: '#5865e8' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
