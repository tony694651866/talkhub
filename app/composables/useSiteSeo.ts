import { toValue, type MaybeRefOrGetter } from 'vue'

/** 受 useSeoMeta 支持的 og:type 取值 */
type OgType = 'website' | 'article' | 'profile' | 'book'

/** 站点 SEO 配置（统一替换各页面的 useHead / useSeoMeta） */
export interface SiteSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /** Open Graph type，默认 website */
  type?: MaybeRefOrGetter<OgType>
  /** 分享图，相对路径会自动补全为绝对地址 */
  image?: MaybeRefOrGetter<string>
  /** 结构化数据，如 DiscussionForumPosting / Article / ProfilePage */
  jsonLd?: MaybeRefOrGetter<Record<string, unknown> | undefined | null>
  /** 私有页面设为 true，输出 noindex, nofollow */
  noindex?: MaybeRefOrGetter<boolean>
  /** 详情页规范路径（不含 query），默认取当前路由 path */
  canonicalPath?: MaybeRefOrGetter<string>
}

const SITE_NAME = 'TalkHub'

/** 读取运行时注入的站点域名（部署时只需改 NUXT_PUBLIC_SITE_URL） */
export function useSiteUrl(): string {
  const config = useRuntimeConfig()
  const raw = (config.public.siteUrl as string | undefined) ?? 'https://talkhub.example.com'
  return raw.replace(/\/+$/, '')
}

export function useSiteSeo(options: SiteSeoOptions) {
  const siteUrl = useSiteUrl()
  const route = useRoute()

  const canonical = computed(() => {
    const raw = toValue(options.canonicalPath) ?? route.path
    const withSlash = raw.startsWith('/') ? raw : `/${raw}`
    // canonical 永远不带 query 与 hash
    return `${siteUrl}${withSlash.replace(/[?#].*$/, '')}`
  })

  const title = computed(() => toValue(options.title))
  const description = computed(() => toValue(options.description))
  const ogType = computed(() => toValue(options.type) || 'website')
  const image = computed(() => {
    const raw = toValue(options.image) || '/favicon.svg'
    if (/^https?:\/\//.test(raw)) return raw
    return `${siteUrl}${raw.startsWith('/') ? raw : `/${raw}`}`
  })
  const robots = computed(() => toValue(options.noindex) ? 'noindex, nofollow' : 'index, follow')

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType,
    ogUrl: canonical,
    ogImage: image,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: options.jsonLd
      ? [{
          type: 'application/ld+json',
          innerHTML: computed(() => {
            const data = toValue(options.jsonLd)
            return data ? JSON.stringify(data) : ''
          }),
        }]
      : [],
  })
}
