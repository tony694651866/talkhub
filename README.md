# TalkHub

以兴趣圈子（吧）为单位的现代化讨论社区，基于 Nuxt 4 构建的 SSR 演示项目。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Nuxt 4（Vue 3.5） |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite` 插件方式接入，无 `tailwind.config`） |
| SEO | `@nuxtjs/sitemap` ^8.6.2、`@nuxtjs/robots` ^6.2.4、自研 `useSiteSeo` 组合式函数 |
| 图标 | `lucide-vue-next` |
| 校验 | `zod` |
| 类型检查 | `typescript` ^5.9、`vue-tsc` |

## 快速开始

```bash
pnpm install        # 或 npm install；postinstall 会自动执行 nuxt prepare
npm run dev         # 本地开发，http://localhost:3000
npm run build       # 生产构建（SSR 产物，node .output/server/index.mjs）
npm run generate    # 静态生成（SSG，输出 .output/public）
npm run preview     # 预览构建产物
```

### 站点域名

部署时通过环境变量 `NUXT_PUBLIC_SITE_URL` 指定正式域名（默认 `https://talkhub.example.com`）：

```bash
NUXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

该值同时驱动：canonical 链接、og:url / og:image 绝对地址、JSON-LD 中的 URL、sitemap 与 robots 的 sitemap 地址。**换域名只改这一个变量即可，无需改动任何页面代码。**

## 渲染策略（SSR / SSG / ISR / SWR）

所有策略集中在 `nuxt.config.ts` 的 `routeRules` 中声明，页面代码无需感知。

| 路由 | 策略 | 说明 |
| --- | --- | --- |
| `/`、`/forums`、`/discover`、`/rankings` | SSR + SWR（`swr: 300`） | 首次请求服务端渲染并缓存，5 分钟后后台再生成（增量式更新，等同 ISR 效果） |
| `/search` | SSR + SWR（`swr: 60`）+ `robots: false` | 结果随查询变化，缓存短；对搜索引擎禁抓 |
| `/p/**`、`/f/**`、`/u/**` | SSG（`prerender: true`） | 帖子/吧/用户公开详情页，构建时静态生成 |
| `/me`、`/messages`、`/post/create`、`/manage/**`、`/admin/**` | `prerender: false` + `robots: false` | 私有页：不预渲染、不进 sitemap、robots 禁抓 |
| `/**` | 全局安全响应头 | nosniff / X-Frame-Options / Referrer-Policy 等 |

### 新增页面如何配置 routeRules

```ts
// nuxt.config.ts
routeRules: {
  // 公开列表页 → SWR 缓存 5 分钟
  '/topics': { swr: 300 },
  // 公开详情页 → 构建时预渲染
  '/t/**': { prerender: true },
  // 登录后才能看的私有页 → 关闭预渲染并禁止索引
  '/settings/**': { prerender: false, robots: false },
}
```

### 预渲染路由为何不用 crawlLinks（重要）

本项目 **没有开启 `nitro.prerender.crawlLinks`**，而是在 `nuxt.config.ts` 中从 `app/utils/mock-data.ts` **显式生成**预渲染路由列表：

```ts
nitro: {
  prerender: {
    crawlLinks: false,
    routes: [
      '/',
      ...forums.flatMap((f) => [`/f/${f.slug}`, `/f/${f.slug}/rules`, `/f/${f.slug}/members`]),
      ...posts.map((p) => `/p/${p.id}`),
      ...users.map((u) => `/u/${u.username}`),
    ],
  },
},
```

原因：Windows 下 `crawlLinks` 会在抓取 `_payload.json` 时触发 `EPERM` 错误导致 `generate` 失败。因此**新增动态路由时，必须同步把该路由加进 `nitro.prerender.routes`（数据源同样来自 mock 数据），否则该路由不会被预渲染**。

## SEO 实现指南

所有页面的标题、元信息、canonical、OG/Twitter 卡片、JSON-LD、robots meta 都通过统一的组合式函数 `app/composables/useSiteSeo.ts` 输出，页面里不要直接写 `useHead` / `useSeoMeta`。

### 页面标题与元信息（useSiteSeo）

```ts
function useSiteSeo(options: SiteSeoOptions): void
```

`SiteSeoOptions` 字段（全部支持 `MaybeRefOrGetter`，即可传字符串、ref 或 getter 函数）：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 页面标题 |
| `description` | `string` | 描述，同时用于 meta description 与 og/twitter description |
| `type` | `'website' \| 'article' \| 'profile' \| 'book'` | og:type，默认 `website` |
| `image` | `string` | 分享图，相对路径自动补全为站点绝对地址，默认 `/favicon.svg` |
| `jsonLd` | `Record<string, unknown>` | 结构化数据对象，输出为 `application/ld+json` script |
| `noindex` | `boolean` | 私有页设 `true`，输出 `noindex, nofollow` |
| `canonicalPath` | `string` | 详情页规范路径（不含 query），默认取当前 `route.path` |

公开详情页示例（`app/pages/p/[postId].vue`）：

```ts
const { data: post, error } = await useAsyncData(`post-${postId}`, () => getPost(postId))
if (error.value || !post.value) {
  throw createError({ statusCode: 404, message: '帖子不存在或已被删除', fatal: true })
}

useSiteSeo({
  title: () => `${post.value?.title ?? ''} · TalkHub`,
  description: () => post.value?.excerpt ?? '',
  type: 'article',
  canonicalPath: `/p/${postId}`,
  jsonLd: () => buildDiscussionForumPosting(post.value),
})
```

私有页示例（`app/pages/me.vue`）——只需 `title` / `description` / `noindex` 三个字段：

```ts
useSiteSeo({
  title: '个人中心 · TalkHub',
  description: '管理你的帖子、收藏与个人资料。',
  noindex: true,
})
```

### JSON-LD 结构化数据

按页面类型使用不同的 schema.org 类型，全部通过 `useSiteSeo` 的 `jsonLd` 字段传入，函数返回 `undefined` 时不输出 script。

帖子页 → `DiscussionForumPosting`（`app/pages/p/[postId].vue`）：

```ts
jsonLd: () => {
  const p = post.value
  if (!p) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: p.title,
    description: p.excerpt,
    url: `${siteUrl}/p/${p.id}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/p/${p.id}` },
    author: { '@type': 'Person', name: p.authorNickname, url: `${siteUrl}/u/${p.author}` },
    articleSection: p.forumName,
    keywords: p.tags.join(', '),
    interactionStatistic: [
      { '@type': 'InteractionCounter', interactionType: { '@type': 'LikeAction' }, userInteractionCount: p.likeCount },
      { '@type': 'InteractionCounter', interactionType: { '@type': 'CommentAction' }, userInteractionCount: p.commentCount },
    ],
  }
}
```

吧页 → `DiscussionForum`（`app/pages/f/[slug].vue`）：

```ts
jsonLd: () => ({
  '@context': 'https://schema.org',
  '@type': 'DiscussionForum',
  name: forum.value?.name,
  description: forum.value?.description,
  url: `${siteUrl}/f/${forum.value?.slug}`,
  numberOfMembers: forum.value?.memberCount,
})
```

用户页 → `ProfilePage`（`app/pages/u/[username].vue`）：

```ts
jsonLd: () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: user.value?.nickname,
  description: user.value?.bio,
  url: `${siteUrl}/u/${user.value?.username}`,
  mainEntity: { '@type': 'Person', name: user.value?.nickname, url: `${siteUrl}/u/${user.value?.username}` },
})
```

### 私有页 noindex

私有页统一靠 `useSiteSeo({ noindex: true })` 输出 `robots: noindex, nofollow`，覆盖以下路由：

- `/me`（个人中心）
- `/messages`（私信）
- `/post/create`（发帖）
- `/manage/**`（吧管理后台）
- `/admin/**`（站点后台）
- `/search`（搜索结果，另由 routeRules 的 `robots: false` 禁止抓取）
- `app/error.vue`（错误页，同样调用 `useSiteSeo({ ..., noindex: true })`）

**新增私有页面时**：在 `nuxt.config.ts` 顶部的 `privateRoutes` 数组中加入路由，并在页面 `<script setup>` 里调用 `useSiteSeo({ ..., noindex: true })`。加入 `privateRoutes` 后会一次性生效于三处：

1. `routeRules`：`prerender: false` + `robots: false`（不预渲染、响应头禁抓）；
2. `sitemap.exclude`：不进 sitemap；
3. `robots.disallow`：robots.txt 中 Disallow。

### sitemap 与 robots

**sitemap**（`@nuxtjs/sitemap`）：`sitemap.urls` 是一个工厂函数，动态 slug 同样来自 `app/utils/mock-data.ts` 的 `forums` / `posts` / `users`，与预渲染路由共用同一数据源：

```ts
sitemap: {
  urls: () => [
    { loc: '/', priority: 1, changefreq: 'daily' },
    { loc: '/forums', priority: 0.9, changefreq: 'daily' },
    // ...
    ...forums.map((f) => ({ loc: `/f/${f.slug}`, priority: 0.8, changefreq: 'weekly' })),
    ...posts.map((p) => ({ loc: `/p/${p.id}`, priority: 0.6, changefreq: 'weekly' })),
    ...users.map((u) => ({ loc: `/u/${u.username}`, priority: 0.5, changefreq: 'monthly' })),
  ],
  exclude: privateRoutes,   // 私有路由在此被排除
  zeroPrerender: true,      // 未预渲染的私有路由不生成
},
```

**robots**（`@nuxtjs/robots`）：

```ts
robots: {
  sitemap: ['/sitemap.xml'],
  disallow: [...privateRoutes, '/search'],
  metaTag: false, // robots meta 由 useSiteSeo 统一输出，避免重复标签
},
```

生成的 robots.txt Disallow 清单：

```
Disallow: /me
Disallow: /messages
Disallow: /post/create
Disallow: /manage/
Disallow: /admin/
Disallow: /search
```

**新增动态路由时需要同步修改两处**：`nitro.prerender.routes`（预渲染）与 `sitemap.urls`（收录）。

### canonical 与域名

- 域名唯一来源是 `NUXT_PUBLIC_SITE_URL`（`nuxt.config.ts` 注入 `runtimeConfig.public.siteUrl`），`useSiteUrl()` 读取并去掉尾部斜杠。
- `useSiteSeo` 自动生成 `<link rel="canonical">`：默认取当前 `route.path`，会**剥掉 query 和 hash**；列表页带筛选参数（如 `/f/game?tab=hot`）时 canonical 指向 `/f/game`。
- 详情页（`/p/:id`、`/f/:slug`、`/u/:username`）建议显式传 `canonicalPath`，避免动态段解析差异。
- og:url 与 canonical 保持一致；og:image 相对路径会自动拼上站点域名。

## 新增页面 Checklist

新增一个页面时按此逐项确认：

1. [ ] 页面 `<script setup>` 调用 `useSiteSeo`，公开页必填 `title` / `description`（详情页再传 `type`、`canonicalPath`、`jsonLd`）。
2. [ ] 私有页设 `noindex: true`，并把路由加入 `nuxt.config.ts` 的 `privateRoutes`。
3. [ ] 在 `routeRules` 里声明策略：列表页 `{ swr: 300 }`、详情页 `{ prerender: true }`、私有页 `{ prerender: false, robots: false }`。
4. [ ] 动态详情页：把路由模式加入 `routeRules`，并在 `nitro.prerender.routes` 与 `sitemap.urls` 中补充对应条目（数据源来自 `app/utils/mock-data.ts`，不要开启 `crawlLinks`）。
5. [ ] 数据获取用 `await useAsyncData(key, fetcher)`，key 唯一；数据不存在时 `throw createError({ statusCode: 404, fatal: true })`。
6. [ ] 运行 `npm run dev` 后用「查看网页源代码」确认标题、description、canonical、JSON-LD 均已服务端渲染输出。

## 常见问题

**Q：类型报错「对象可能为 undefined」？**
项目开启/兼容 `noUncheckedIndexedAccess` 风格的严格索引访问：`arr[i]`、`find()` 返回值都是 `T | undefined`，需要用 `?.`、`!`（确认非空时）或显式判空处理。页面里大量 `post.value!.xxx` 就是在 `useAsyncData` 判空之后的安全断言。

**Q：`.nuxt` 类型不存在 / 编辑器飘红？**
先执行 `nuxt prepare`（`npm install` 的 postinstall 已包含）。若刚新增了 composables 或目录结构变化，重新跑一次让 Nuxt 重建类型声明。

**Q：如何跑类型检查？**
项目内置 `vue-tsc`，需要时执行：

```bash
npx vue-tsc --noEmit
```

**Q：`npm run generate` 在 Windows 上报 EPERM？**
检查 `nuxt.config.ts` 是否误开了 `crawlLinks: true`。本项目靠显式 `routes` 预渲染，不要开启 crawlLinks（原因见「渲染策略」一节）。
