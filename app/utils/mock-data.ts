import type {
  User, Forum, Post, Comment, HeroSlide, Topic, Announcement, Notification,
} from '../../shared/types'

// ================= 用户 =================
export const users: User[] = [
  { id: 'u1', username: 'linwu', nickname: '林雾', bio: '全栈开发者 / 数字花园园丁', avatarColors: ['#5865e8', '#8b5cf6'], level: 12, points: 9860, followers: 3241, following: 128, joinedAt: '2023-03-14', coverColors: ['#5865e8', '#7c3aed'] },
  { id: 'u2', username: 'sugar', nickname: '糖糖不爱糖', bio: '独立游戏开发者，正在做一款像素 Roguelike', avatarColors: ['#f07848', '#f43f5e'], level: 9, points: 5120, followers: 1876, following: 89, joinedAt: '2023-06-02', coverColors: ['#f07848', '#ef4444'] },
  { id: 'u3', username: 'nightcat', nickname: '夜猫子', bio: '凌晨三点的社群观察员', avatarColors: ['#0ea5e9', '#6366f1'], level: 10, points: 6730, followers: 2105, following: 233, joinedAt: '2022-11-20', coverColors: ['#0ea5e9', '#6366f1'] },
  { id: 'u4', username: 'moshang', nickname: '陌上花开', bio: '胶片摄影 / 城市|夜|人', avatarColors: ['#20a779', '#0d9488'], level: 8, points: 4380, followers: 1543, following: 67, joinedAt: '2023-01-08', coverColors: ['#20a779', '#0d9488'] },
  { id: 'u5', username: 'yucandie', nickname: '余酱', bio: '动漫考古学家，老番鉴定师', avatarColors: ['#e879f9', '#a855f7'], level: 7, points: 3120, followers: 988, following: 312, joinedAt: '2023-09-17', coverColors: ['#e879f9', '#a855f7'] },
  { id: 'u6', username: 'haibao', nickname: '海豹摸鱼中', bio: '产品经理 / 效率工具收藏家', avatarColors: ['#e9a23b', '#f97316'], level: 11, points: 7650, followers: 2870, following: 45, joinedAt: '2022-08-30', coverColors: ['#e9a23b', '#f97316'] },
  { id: 'u7', username: 'kite', nickname: '追风筝的人', bio: '跑步爱好者，马拉松 PB 3:28', avatarColors: ['#14b8a6', '#3b82f6'], level: 6, points: 2450, followers: 655, following: 190, joinedAt: '2024-02-11', coverColors: ['#14b8a6', '#3b82f6'] },
  { id: 'u8', username: 'admin', nickname: 'TalkHub 官方', bio: '社区运营团队', avatarColors: ['#4653d4', '#5865e8'], level: 99, points: 99999, followers: 12000, following: 3, joinedAt: '2022-01-01', coverColors: ['#4653d4', '#7c3aed'] },
]

// ================= 吧 =================
export const forums: Forum[] = [
  { id: 'f1', slug: 'game', name: '游戏研究所', category: '游戏', description: '聊新作、聊独立游戏、聊设计和彩蛋，这里是玩家的茶话会。', coverColors: ['#6d5ce8', '#9333ea'], avatarColors: ['#6d5ce8', '#a855f7'], icon: 'gamepad-2', memberCount: 128430, postCount: 45210, todayPosts: 342, createdAt: '2022-03-15', owner: 'sugar', moderators: ['sugar', 'yucandie'], rules: ['禁止人身攻击与引战', '剧透请提前标注', '禁止发布盗版资源链接'], announcements: [{ id: 'a1', title: '2026 年度游戏大讨论活动开启，参与赢周边', date: '11-05' }], tags: ['主机游戏', '独立游戏', '游戏设计'] },
  { id: 'f2', slug: 'tech', name: '科技前哨站', category: '科技', description: 'AI、硬件、行业动态的第一手讨论区。', coverColors: ['#0ea5e9', '#3b82f6'], avatarColors: ['#0ea5e9', '#38bdf8'], icon: 'cpu', memberCount: 96210, postCount: 32110, todayPosts: 218, createdAt: '2022-05-20', owner: 'linwu', moderators: ['linwu', 'haibao'], rules: ['新闻请附来源', '禁止无依据爆料', '理性讨论厂商'], announcements: [{ id: 'a2', title: 'AI 专题月：每周三晚八点圆桌直播', date: '11-02' }], tags: ['AI', '硬件', '互联网'] },
  { id: 'f3', slug: 'movie', name: '光影放映室', category: '影视', description: '电影、剧集、纪录片，看完聊透。', coverColors: ['#e11d48', '#f97316'], avatarColors: ['#e11d48', '#fb7185'], icon: 'clapperboard', memberCount: 76340, postCount: 25400, todayPosts: 156, createdAt: '2022-07-11', owner: 'nightcat', moderators: ['nightcat'], rules: ['标题党内容会被移除', '老片也欢迎新讨论'], announcements: [], tags: ['电影', '剧集', '影评'] },
  { id: 'f4', slug: 'anime', name: '二次元收容所', category: '动漫', description: '新番、老番、漫画、手办，二次元浓度超标警告。', coverColors: ['#d946ef', '#a855f7'], avatarColors: ['#d946ef', '#e879f9'], icon: 'sparkles', memberCount: 88900, postCount: 39870, todayPosts: 287, createdAt: '2022-04-02', owner: 'yucandie', moderators: ['yucandie'], rules: ['讨论分季动画请标注季度', '禁止无关广告'], announcements: [{ id: 'a3', title: '十月新番追番表已更新', date: '10-28' }], tags: ['新番', '漫画', '手办'] },
  { id: 'f5', slug: 'life', name: '生活漫游指南', category: '生活', description: '做饭、租房、旅行、省钱，认真生活的每一个瞬间。', coverColors: ['#f59e0b', '#ef4444'], avatarColors: ['#f59e0b', '#fbbf24'], icon: 'coffee', memberCount: 54320, postCount: 18760, todayPosts: 98, createdAt: '2022-09-01', owner: 'haibao', moderators: ['haibao', 'kite'], rules: ['分享真实生活经验', '禁止拉踩引战'], announcements: [], tags: ['美食', '旅行', '租房'] },
  { id: 'f6', slug: 'photo', name: '摄影取景框', category: '生活', description: '从手机随手拍到中画幅，都在这里晒作品。', coverColors: ['#14b8a6', '#0ea5e9'], avatarColors: ['#14b8a6', '#2dd4bf'], icon: 'camera', memberCount: 43110, postCount: 15230, todayPosts: 76, createdAt: '2022-10-18', owner: 'moshang', moderators: ['moshang'], rules: ['发图请附拍摄参数', '禁止盗图'], announcements: [{ id: 'a4', title: '「城市夜色」摄影征集：11 月 30 日截稿', date: '11-01' }], tags: ['器材', '后期', '扫街'] },
  { id: 'f7', slug: 'study', name: '自习室夜灯', category: '学习', description: '考研、考证、语言学习、读书笔记，一起自习。', coverColors: ['#3b82f6', '#6366f1'], avatarColors: ['#3b82f6', '#60a5fa'], icon: 'book-open', memberCount: 39800, postCount: 12450, todayPosts: 64, createdAt: '2023-01-26', owner: 'linwu', moderators: ['linwu'], rules: ['打卡帖请使用模板', '禁止代考广告'], announcements: [], tags: ['考研', '英语', '读书'] },
  { id: 'f8', slug: 'running', name: '跑步心跳线', category: '运动', description: '从 3 公里到全马，每一步都算数。', coverColors: ['#20a779', '#84cc16'], avatarColors: ['#20a779', '#4ade80'], icon: 'footprints', memberCount: 28650, postCount: 9320, todayPosts: 45, createdAt: '2023-03-08', owner: 'kite', moderators: ['kite'], rules: ['跑量炫耀自由', '受伤经验分享请详述'], announcements: [], tags: ['马拉松', '装备', '配速'] },
  { id: 'f9', slug: 'dev', name: '代码搬运工', category: '科技', description: '前端、后端、AI 工程，搬砖心得与踩坑实录。', coverColors: ['#4653d4', '#5865e8'], avatarColors: ['#4653d4', '#6366f1'], icon: 'code-2', memberCount: 61200, postCount: 21400, todayPosts: 132, createdAt: '2022-06-14', owner: 'linwu', moderators: ['linwu', 'nightcat'], rules: ['提问请附最小复现', '禁止低质广告'], announcements: [], tags: ['前端', 'AI 工程', '架构'] },
  { id: 'f10', slug: 'emotion', name: '深夜树洞', category: '情感', description: '说给陌生人听的那些话，都会被温柔接住。', coverColors: ['#8b5cf6', '#ec4899'], avatarColors: ['#8b5cf6', '#c084fc'], icon: 'message-circle-heart', memberCount: 47230, postCount: 20110, todayPosts: 178, createdAt: '2022-08-22', owner: 'nightcat', moderators: ['nightcat', 'moshang'], rules: ['禁止人身攻击', '共情优先，说教适度'], announcements: [], tags: ['心事', '治愈', '共鸣'] },
]

// ================= 轮播 =================
export const heroSlides: HeroSlide[] = [
  { id: 'h1', eyebrow: '本周精选', title: 'AI 正在重写开发者工具链', description: '从代码补全到自主 Agent，看看《科技前哨站》与《代码搬运工》的两千条深度讨论。', tags: ['AI', '开发者', '本周热点'], actionText: '进入话题', actionUrl: '/f/tech', secondaryActionText: '查看榜单', secondaryActionUrl: '/rankings', colors: ['#4f46e5', '#7c3aed'], thumbColors: ['#4f46e5', '#8b5cf6'] },
  { id: 'h2', eyebrow: '新吧推荐', title: '「跑步心跳线」：从 3 公里到全马', description: '28650 位跑者在这里打卡配速、分享装备，每一步都算数。', tags: ['运动', '马拉松', '打卡'], actionText: '去看看', actionUrl: '/f/running', secondaryActionText: '更多新吧', secondaryActionUrl: '/forums', colors: ['#0d9488', '#22c55e'], thumbColors: ['#0d9488', '#4ade80'] },
  { id: 'h3', eyebrow: '社区活动', title: '「城市夜色」摄影作品征集中', description: '用镜头记录夜色里的城市，优秀作品将在首页精选展出。11 月 30 日截稿。', tags: ['摄影', '征集', '有奖'], actionText: '参加活动', actionUrl: '/f/photo', secondaryActionText: '活动规则', secondaryActionUrl: '/f/photo', colors: ['#b45309', '#f59e0b'], thumbColors: ['#d97706', '#fbbf24'] },
  { id: 'h4', eyebrow: '精华专题', title: '本月值得阅读的 12 篇帖子', description: '编辑部从 8 万条新帖中挑出的长文：独立游戏开发、AI 落地、城市漫游与深夜树洞。', tags: ['精选', '长文', '月度'], actionText: '阅读专题', actionUrl: '/discover', secondaryActionText: '更多精选', secondaryActionUrl: '/discover', colors: ['#be123c', '#f97316'], thumbColors: ['#e11d48', '#fb7185'] },
]

// ================= 分类 =================
export const categories = [
  { name: '游戏', icon: 'gamepad-2', color: '#6d5ce8', forumCount: 128 },
  { name: '科技', icon: 'cpu', color: '#0ea5e9', forumCount: 96 },
  { name: '影视', icon: 'clapperboard', color: '#e11d48', forumCount: 74 },
  { name: '动漫', icon: 'sparkles', color: '#d946ef', forumCount: 88 },
  { name: '生活', icon: 'coffee', color: '#f59e0b', forumCount: 152 },
  { name: '情感', icon: 'message-circle-heart', color: '#ec4899', forumCount: 45 },
  { name: '学习', icon: 'book-open', color: '#3b82f6', forumCount: 67 },
  { name: '运动', icon: 'footprints', color: '#20a779', forumCount: 39 },
]

// ================= 话题 =================
export const topics: Topic[] = [
  { id: 't1', name: 'AI Agent 落地', heat: 9820, postCount: 1240 },
  { id: 't2', name: '年度游戏', heat: 8760, postCount: 1120 },
  { id: 't3', name: '十月新番', heat: 7640, postCount: 980 },
  { id: 't4', name: '城市夜色', heat: 6520, postCount: 764 },
  { id: 't5', name: '效率工具', heat: 5410, postCount: 645 },
  { id: 't6', name: '独立开发', heat: 4890, postCount: 570 },
  { id: 't7', name: '马拉松备赛', heat: 3760, postCount: 412 },
  { id: 't8', name: '深夜树洞', heat: 3210, postCount: 388 },
  { id: 't9', name: '考研倒计时', heat: 2980, postCount: 356 },
  { id: 't10', name: '手机摄影', heat: 2540, postCount: 296 },
]

export const announcements: Announcement[] = [
  { id: 'n1', title: 'TalkHub 2.0 上线：全新视觉与话题系统', date: '11-06' },
  { id: 'n2', title: '社区公约更新：请勿发布未标注的 AI 生成内容', date: '11-03' },
  { id: 'n3', title: '11 月「城市夜色」摄影活动开启', date: '11-01' },
]

// ================= 帖子 =================
const block = {
  p: (text: string) => ({ type: 'p' as const, text }),
  h2: (text: string) => ({ type: 'h2' as const, text }),
  quote: (text: string) => ({ type: 'quote' as const, text }),
  code: (lang: string, text: string) => ({ type: 'code' as const, lang, text }),
  img: (alt: string, c1: string, c2: string) => ({ type: 'img' as const, src: '', alt, colors: [c1, c2] as [string, string] }),
  ul: (items: string[]) => ({ type: 'ul' as const, items }),
}

export const posts: Post[] = [
  {
    id: 'p1', title: '我把 AI Agent 接进了日常开发流程，两个月后的真实体会', forumSlug: 'dev', forumName: '代码搬运工', forumAvatarColors: ['#4653d4', '#6366f1'],
    author: 'linwu', authorNickname: '林雾', authorColors: ['#5865e8', '#8b5cf6'], createdAt: '2 小时前', excerpt: '不是营销文。两个月里我让 Agent 参与了三个真实项目，这篇聊聊哪些环节真的省时间，哪些环节纯属自欺欺人。',
    content: [
      block.p('两个月前我开始认真把 AI Agent 接入日常开发：不是玩票，而是让它参与三个真实项目的迭代。今天做个阶段性复盘，尽量说真话。'),
      block.h2('真正省时间的三个环节'),
      block.ul(['写脚手架与样板代码：省下至少 30% 的初始化时间', '单测补充：覆盖率从 41% 拉到 78%，人工只做边界 case', '依赖升级排查：breaking change 的阅读成本几乎归零']),
      block.p('最惊喜的是依赖升级。以前一次大版本升级要半天翻 changelog，现在 Agent 直接列出受影响的调用点，我只需要做决策。'),
      block.quote('工具的价值不在于它多聪明，而在于它把你从「不想做的事」里解放出来。'),
      block.h2('两个纯属自欺欺人的场景'),
      block.p('第一是复杂业务逻辑设计。Agent 给出的方案看起来工整，但缺少对业务约束的理解，返工成本比手写还高。第二是线上问题定位——日志上下文喂不进去，它就只能泛泛而谈。'),
      block.code('ts', `// 我的折中方案：Agent 负责"广度"，人负责"深度"\nconst tasks = plan.splitByComplexity();\ntasks.simple.forEach(t => agent.execute(t));\ntasks.complex.forEach(t => human.review(agent.draft(t)));`),
      block.p('总结：把 Agent 当成一个不知疲倦的初级同事，而不是架构师。给它明确边界，它会还你一个不错的杠杆率。'),
    ],
    images: [],
    viewCount: 12400, likeCount: 862, commentCount: 156, favoriteCount: 423,
    tags: ['AI Agent', '工程效率'], badges: ['essence', 'hot'], type: 'text',
  },
  {
    id: 'p2', title: '像素 Roguelike 开发日志 #14：怪物 AI 的三种「假聪明」', forumSlug: 'game', forumName: '游戏研究所', forumAvatarColors: ['#6d5ce8', '#a855f7'],
    author: 'sugar', authorNickname: '糖糖不爱糖', authorColors: ['#f07848', '#f43f5e'], createdAt: '4 小时前', excerpt: '让怪物显得聪明，不需要真的聪明。这期聊聊三种成本低、效果好的「假智能」设计，附实现思路。',
    content: [
      block.p('做独立游戏两年，最大的心得是：玩家感知到的智能 > 实际的智能。这期开发日志分享三种我们实际在用的「假聪明」设计。'),
      block.h2('一、视线记忆'),
      block.p('怪物不需要真的做寻路，只需要记住玩家最后出现的位置，朝那个方向搜索几秒。玩家的解读是「它记得我在哪」，实际上它只是朝一个固定点瞎转。'),
      block.img('视线记忆示意图', '#6d5ce8', '#a855f7'),
      block.h2('二、失败后的「学习」'),
      block.quote('玩家第二次用同样的方法击败同一类怪时，怪的表现必须不同——哪怕只是换个出场方向。'),
      block.p('我们给每类怪存一个被击杀记录的 flag，下次生成时随机调整入场位。测试玩家反馈明显：「这游戏怪会进步」。'),
      block.h2('三、群体的牺牲品'),
      block.p('群体战斗里，让 30% 的怪「鲁莽」，70% 的怪「谨慎」。鲁莽的怪冲得快死得快，谨慎的怪围着绕。玩家看到的是「有战术」，实际是两个固定行为树。'),
      block.p('下期日志聊聊 Boss 战的多阶段演出成本控制，欢迎在评论区点菜。'),
    ],
    images: [{ colors: ['#6d5ce8', '#a855f7'], alt: '怪物 AI 行为树示意' }],
    viewCount: 8920, likeCount: 634, commentCount: 98, favoriteCount: 210,
    tags: ['独立游戏', '游戏设计'], badges: ['essence'], type: 'image',
  },
  {
    id: 'p3', title: '【投票】2026 年你最想看到的年度游戏是哪款？', forumSlug: 'game', forumName: '游戏研究所', forumAvatarColors: ['#6d5ce8', '#a855f7'],
    author: 'nightcat', authorNickname: '夜猫子', authorColors: ['#0ea5e9', '#6366f1'], createdAt: '6 小时前', excerpt: '一年一度的站队环节来了。选出你的年度游戏，投票截止 11 月 30 日，结果会在首页专题里公布。',
    content: [
      block.p('又是一年一度的大型站队现场。规则很简单：一人一票，投票截止 11 月 30 日 24:00。也可以在评论区安利你的选择——记得带上理由，单纯的「就是好玩」会被树洞收编。'),
      block.quote('去年《星穹旅人》以 42% 的得票率夺冠，今年会不会有黑马？'),
    ],
    images: [],
    viewCount: 15200, likeCount: 421, commentCount: 287, favoriteCount: 89,
    tags: ['年度游戏', '投票'], badges: ['vote', 'top'], type: 'vote',
    vote: { options: [{ label: '《环宇回响》', count: 3240 }, { label: '《像素深渊 2》', count: 2870 }, { label: '《星轨旅人：终章》', count: 2150 }, { label: '《雾都档案》', count: 1560 }], deadline: '11-30', total: 9820 },
  },
  {
    id: 'p4', title: '凌晨一点的伦敦桥与《雾都档案》：一次游戏旅行的记录', forumSlug: 'movie', forumName: '光影放映室', forumAvatarColors: ['#e11d48', '#fb7185'],
    author: 'moshang', authorNickname: '陌上花开', authorColors: ['#20a779', '#0d9488'], createdAt: '9 小时前', excerpt: '玩完游戏第二天我就订了去伦敦的机票。这不是攻略，是关于虚拟与现实重影的一次记录，附 12 张胶片扫描。',
    content: [
      block.p('通关《雾都档案》的当晚，我做了一件很久没做过的事：凌晨一点在地图上找游戏里那座桥。两周后，我站在了真实的它面前。'),
      block.img('雾都清晨', '#334155', '#0ea5e9'),
      block.h2('游戏地图与真实城市'),
      block.p('制作组显然来过这里。游戏里杂货铺的位置、桥面栏杆的花纹、甚至远处教堂的剪影角度，都和现实对得上。站在游戏视角的原点，那种重影感很难描述。'),
      block.ul(['胶片：Portra 400 + Olympus mju-II', '扫街时段：清晨 5:30 - 7:00', '地点：伦敦桥、Borough 市场、泰晤士南岸']),
      block.img('南岸晨雾', '#0f766e', '#14b8a6'),
      block.p('最后一张是在回程的船上拍的。雾散了一半，城市刚好在虚实之间。我想这就是这个游戏想说的东西。'),
    ],
    images: [{ colors: ['#334155', '#0ea5e9'], alt: '雾都清晨' }, { colors: ['#0f766e', '#14b8a6'], alt: '南岸晨雾' }],
    viewCount: 6840, likeCount: 512, commentCount: 76, favoriteCount: 188,
    tags: ['游戏旅行', '胶片'], badges: ['essence', 'hot'], type: 'image',
  },
  {
    id: 'p5', title: '十月新番半程盘点：三匹黑马和一部被低估的宝藏', forumSlug: 'anime', forumName: '二次元收容所', forumAvatarColors: ['#d946ef', '#e879f9'],
    author: 'yucandie', authorNickname: '余酱', authorColors: ['#e879f9', '#a855f7'], createdAt: '昨天 21:40', excerpt: '追番表过半，趁热打铁做个半程盘点。有一部制作组穷但分镜逆天的宝藏番，想安利给每一个等量产番的人。',
    content: [
      block.p('半程了，该交作业了。十月这季新番数量不少，但真正的惊喜集中在三匹黑马和一部差点被埋没的宝藏上。'),
      block.h2('黑马一：《齿轮法则》'),
      block.p('蒸汽朋克世界观 + 硬核机械设定，第一集的作画信息量大到要暂停看细节。原作党表示改编意外地忠实。'),
      block.h2('黑马二：《雨停之后》'),
      block.quote('每集结尾的那一句台词，值得整集的铺垫。'),
      block.p('日常系里藏着对「失去」最温柔的处理。制作组几乎不宣传，全靠口口相传，目前播放量是同期最低，但评分最高。'),
      block.h2('被低估的宝藏：《纸境灯行》'),
      block.p('穷，肉眼可见的穷。但分镜是逆天级别的聪明，用声音和留白补足了作画预算。看第三集雨夜戏的时候我起了鸡皮疙瘩。'),
      block.p('你们追到哪些了？评论区交换一下观感，我在整理追番表 v2。'),
    ],
    images: [],
    viewCount: 7320, likeCount: 488, commentCount: 134, favoriteCount: 156,
    tags: ['十月新番', '追番'], badges: ['hot'], type: 'text',
  },
  {
    id: 'p6', title: '北漂第五年，我终于把 12 平米的出租屋住明白了', forumSlug: 'life', forumName: '生活漫游指南', forumAvatarColors: ['#f59e0b', '#fbbf24'],
    author: 'haibao', authorNickname: '海豹摸鱼中', authorColors: ['#e9a23b', '#f97316'], createdAt: '昨天 19:12', excerpt: '五次搬家换来的小户型生存指南：动线、收纳、光线与一个结论——房子是租的，生活不是。',
    content: [
      block.p('五年搬了五次家，从隔断间到今天的 12 平米朝南小屋，终于把小空间住出了「秩序感」。这篇是给所有租房朋友的生存指南。'),
      block.h2('动线是第一位的'),
      block.p('小空间最怕的不是小，是乱。我的原则：睡觉、工作、吃饭三条动线互不交叉。床不靠书桌，书桌不面对玄关。'),
      block.img('12 平米布局草图', '#d97706', '#f59e0b'),
      block.h2('收纳的「二八原则」'),
      block.ul(['80% 的东西藏进柜子，留白才有呼吸感', '20% 常用的摊开，但必须整齐', '竖向收纳 > 平铺，用足 2 米以上高度']),
      block.quote('房子是租来的，但生活不是。'), 
      block.p('最后一个建议：一定要留一面墙给「喜欢的东西」。我的是明信片墙，每月换一次主题。'),
    ],
    images: [{ colors: ['#d97706', '#f59e0b'], alt: '出租屋布局' }],
    viewCount: 5980, likeCount: 721, commentCount: 92, favoriteCount: 305,
    tags: ['租房', '收纳'], badges: ['essence'], type: 'image',
  },
  {
    id: 'p7', title: '「城市夜色」第一波作品精选：31 张来自 14 个城市的光', forumSlug: 'photo', forumName: '摄影取景框', forumAvatarColors: ['#14b8a6', '#2dd4bf'],
    author: 'moshang', authorNickname: '陌上花开', authorColors: ['#20a779', '#0d9488'], createdAt: '昨天 16:05', excerpt: '活动开跑一周，收到 200+ 投稿。精选 31 张分享给大家，从重庆的雾到里斯本的蓝调时刻。',
    content: [
      block.p('活动开跑一周，「城市夜色」收到了 214 份投稿。筛选到眼瞎之后，精选出 31 张进入首页展池。这里放几张我个人最爱的。'),
      block.img('重庆 · 江雾与灯', '#1e293b', '#f07848'),
      block.img('里斯本 · 蓝调时刻', '#1d4ed8', '#f59e0b'),
      block.quote('夜景摄影的秘诀不是夜，是光与时间赛跑的那二十分钟。'),
      block.p('截稿是 11 月 30 日，还有三周。带上相机出门吧，等一个不需要滤镜的夜。'),
    ],
    images: [{ colors: ['#1e293b', '#f07848'], alt: '重庆夜景' }, { colors: ['#1d4ed8', '#f59e0b'], alt: '里斯本夜景' }],
    viewCount: 4460, likeCount: 390, commentCount: 58, favoriteCount: 143,
    tags: ['城市夜色', '摄影征集'], badges: ['notice', 'hot'], type: 'image',
  },
  {
    id: 'p8', title: '备考 87 天，从英一 52 分到模考 71 分的方法复盘', forumSlug: 'study', forumName: '自习室夜灯', forumAvatarColors: ['#3b82f6', '#60a5fa'],
    author: 'kite', authorNickname: '追风筝的人', authorColors: ['#14b8a6', '#3b82f6'], createdAt: '前天 22:30', excerpt: '不熬鸡汤只讲方法：阅读精读法的具体操作、真题三刷的节奏表，以及为什么我放弃了背单词 App。',
    content: [
      block.p('九月模考 52 分的时候差点弃考。87 天后的模考是 71。不是逆袭爽文，是一次可复制的方法复盘。'),
      block.h2('阅读精读法：一篇吃三遍'),
      block.ul(['第一遍：限时做，只对答案不看解析', '第二遍：逐句翻译长难句，圈出生词但不查', '第三遍：对照解析，把「为什么错」写成一句话贴在错题本上']),
      block.h2('真题三刷节奏表'),
      block.p('一刷按年份、二刷按题型、三刷只刷错题。10 年真题足够，不需要模拟题。'),
      block.quote('单词 App 每天打卡 45 分钟，两个月后阅读里还是不认识它们。真题里的词才是要考的词。'),
      block.p('有具体问题可以评论区问，我在整理错题本模板，整理好发在这个帖子里。'),
    ],
    images: [],
    viewCount: 3980, likeCount: 456, commentCount: 67, favoriteCount: 268,
    tags: ['考研', '方法复盘'], badges: ['essence'], type: 'text',
  },
  {
    id: 'p9', title: '凌晨四点的配速表：如何用 8 周把半马从 2:15 跑进 2:00', forumSlug: 'running', forumName: '跑步心跳线', forumAvatarColors: ['#20a779', '#4ade80'],
    author: 'kite', authorNickname: '追风筝的人', authorColors: ['#14b8a6', '#3b82f6'], createdAt: '前天 18:20', excerpt: '破二没那么玄学。8 周、每周四练、一次长距离，附完整课表和三条血泪教训。',
    content: [
      block.p('破二（半马 2 小时内）大概是跑者最普遍的目标。我的 8 周课表帮三个朋友成功破二，这里完整放出来。'),
      block.h2('每周四练的框架'),
      block.ul(['周二：间歇 6 × 800 米，配速 4:50', '周四：节奏跑 8 公里，配速 5:40', '周六：轻松跑 10 公里，随便多慢都行', '周日：长距离 14 - 18 公里，配速 6:10 - 6:30']),
      block.h2('三条血泪教训'),
      block.quote('长距离慢跑不慢，比赛就会变慢。'),
      block.p('一、长距离真的要慢，心率压在最大心率的 75%。二、比赛前一晚别试新装备。三、最后三公里拼的是前五个月，不是当天。'),
      block.p('配速表图片版在评论区，需要 xls 版的留言。跑起来！'),
    ],
    images: [],
    viewCount: 3120, likeCount: 287, commentCount: 45, favoriteCount: 176,
    tags: ['马拉松', '破二'], badges: [], type: 'text',
  },
  {
    id: 'p10', title: '树洞：今天把辞职信放进抽屉里了，又拿出来看了一遍', forumSlug: 'emotion', forumName: '深夜树洞', forumAvatarColors: ['#8b5cf6', '#c084fc'],
    author: 'nightcat', authorNickname: '夜猫子', authorColors: ['#0ea5e9', '#6366f1'], createdAt: '前天 01:15', excerpt: '没有剧情反转，就是想找个地方放一放。写完发现，树洞的意义可能就是让心事有个落点。',
    content: [
      block.p('今天把辞职信写好了，放进抽屉，又拿出来看了一遍，然后放回去。没交。'),
      block.p('不是因为想通了什么大道理，就是今天项目群里有人说了句「辛苦了」。就四个字，突然觉得还能再撑一阵。'),
      block.quote('成年人的崩溃是静音模式的，好消息是，修复也可以是静音模式的。'),
      block.p('也没什么想问的。就是想说出来。说出来之后，抽屉里的那张纸好像也没那么重了。'),
    ],
    images: [],
    viewCount: 8920, likeCount: 1305, commentCount: 342, favoriteCount: 210,
    tags: ['树洞', '心事'], badges: ['hot'], type: 'text',
  },
  {
    id: 'p11', title: '我给团队写了个 AI 周报机器人，从此没人再编周报了', forumSlug: 'tech', forumName: '科技前哨站', forumAvatarColors: ['#0ea5e9', '#38bdf8'],
    author: 'haibao', authorNickname: '海豹摸鱼中', authorColors: ['#e9a23b', '#f97316'], createdAt: '3 天前', excerpt: '接入仓库与项目看板，每周五自动汇总：做了什么、卡在哪、下周重点。落地三个月，真实效果与翻车记录。',
    content: [
      block.p('周报是全世界最无聊的文字工作。三个月前我写了个机器人，从 Git 仓库和看板自动拉数据生成周报草稿。今天聊聊效果。'),
      block.h2('它做得好的'),
      block.ul(['事实部分零编造：代码量、issue 流转都是真实数据', '每周五 17:00 准时发草稿，人只需要补「思考」部分', '跨项目汇总比人快，也从不抱怨']),
      block.h2('它翻车的地方'),
      block.p('有一次把同事的调试 commit 写成了「核心架构重构」，场面一度非常尴尬。后来加了敏感词过滤和白名单。'),
      block.quote('自动化最好的落点，是把人从重复里捞出来，而不是替人做判断。'),
    ],
    images: [],
    viewCount: 5640, likeCount: 389, commentCount: 78, favoriteCount: 145,
    tags: ['AI', '效率工具'], badges: [], type: 'text',
  },
  {
    id: 'p12', title: '2026 智能手机影像横评：六台旗舰的夜景实测', forumSlug: 'tech', forumName: '科技前哨站', forumAvatarColors: ['#0ea5e9', '#38bdf8'],
    author: 'linwu', authorNickname: '林雾', authorColors: ['#5865e8', '#8b5cf6'], createdAt: '3 天前', excerpt: '同一场景、同一时段、同一只手。六台旗舰的夜景实拍对比，不看参数看成片，结论有点意外。',
    content: [
      block.p('参数发布会看多了，这次换个方式：六个场景、完全一致的时段与机位，只看成片。'),
      block.img('夜景机位实拍对比', '#1e293b', '#8b5cf6'),
      block.h2('最意外的结论'),
      block.p('算法激进的机型在白天赢麻了，但夜景过度锐化让霓虹全部糊成色块。反而是「保守派」的直出最耐看。'),
      block.quote('影像的尽头不是计算，是克制。'),
      block.p('全部 36 张对比图打包放在评论区网盘，自取。'),
    ],
    images: [{ colors: ['#1e293b', '#8b5cf6'], alt: '夜景对比' }],
    viewCount: 9840, likeCount: 612, commentCount: 189, favoriteCount: 234,
    tags: ['手机摄影', '横评'], badges: ['hot'], type: 'image',
  },
  {
    id: 'p13', title: '《环宇回响》通关 60 小时：它可能是今年叙事天花板', forumSlug: 'game', forumName: '游戏研究所', forumAvatarColors: ['#6d5ce8', '#a855f7'],
    author: 'yucandie', authorNickname: '余酱', authorColors: ['#e879f9', '#a855f7'], createdAt: '4 天前', excerpt: '无剧透安利 + 三条 acheter 理由 + 一个劝退警告。玩之前先看这篇，能帮你决定要不要入。',
    content: [
      block.p('60 小时白金通关，趁热写个无剧透评测。结论先说：如果你能接受慢热，这可能是今年叙事的天花板。'),
      block.h2('三个入的理由'),
      block.ul(['双线叙事的结构在第三章之后开始发力，伏笔回收率惊人', '配乐与章节主题绑定，通关后我单曲循环了 OST 一周', '支线不是清单，是补充叙事的另一个声道']),
      block.h2('一个劝退警告'),
      block.p('前两小时节奏确实慢。如果玩到第三章还是无感，那这游戏可能真的不适合你，不用硬撑。'),
      block.quote('好的游戏叙事不是让你看故事，是让你在故事里待过。'),
    ],
    images: [],
    viewCount: 7640, likeCount: 534, commentCount: 167, favoriteCount: 198,
    tags: ['年度游戏', '评测'], badges: ['essence'], type: 'text',
  },
  {
    id: 'p14', title: '一个人吃火锅的仪式感指南（附锅底避雷清单）', forumSlug: 'life', forumName: '生活漫游指南', forumAvatarColors: ['#f59e0b', '#fbbf24'],
    author: 'yucandie', authorNickname: '余酱', authorColors: ['#e879f9', '#a855f7'], createdAt: '4 天前', excerpt: '一个人吃火锅不是将就，是修行。从锅底选择到下菜顺序的完整流程，以及七款网红锅底的真实评价。',
    content: [
      block.p('一个人吃火锅被太多人当成孤独符号，我反对。它是更高阶的美食自由：不用抢毛肚，锅底随便选，追剧不用迁就任何人。'),
      block.h2('锅底避雷清单'),
      block.ul(['网红芝士锅：香精味重，煮三样东西之后只剩腻', '冬阴功预制底：柠檬叶是干碎的，香味出不来', '老坛酸菜底：酸得孤立无援，别信广告']),
      block.h2('下菜顺序的黄金法则'),
      block.p('先耐煮的根茎类垫底出味，肉在汤最沸的时候下，叶子菜最后烫十秒收尾。一顿操作下来，汤越煮越香而不是越煮越浑。'),
      block.quote('一个人也要认真开火。锅气是给自己的底气。'),
    ],
    images: [],
    viewCount: 4210, likeCount: 356, commentCount: 64, favoriteCount: 121,
    tags: ['美食', '独居生活'], badges: [], type: 'text',
  },
]

// ================= 评论 =================
export const comments: Record<string, Comment[]> = {
  p1: [
    { id: 'c1', post: 'p1', author: 'haibao', authorNickname: '海豹摸鱼中', authorColors: ['#e9a23b', '#f97316'], createdAt: '1 小时前', content: '「当成不知疲倦的初级同事」这个比喻太准了。我们团队现在也是这么划边界的：广度给 Agent，深度留给人，返工率肉眼可见地降了。', likeCount: 86, replies: [
      { id: 'c1r1', post: 'p1', author: 'linwu', authorNickname: '林雾', authorColors: ['#5865e8', '#8b5cf6'], createdAt: '50 分钟前', content: '对，边界感比模型能力更重要。', likeCount: 32, replies: [] },
      { id: 'c1r2', post: 'p1', author: 'nightcat', authorNickname: '夜猫子', authorColors: ['#0ea5e9', '#6366f1'], createdAt: '38 分钟前', content: '求问你们用什么方式管边界？prompt 约束还是流程约束？', likeCount: 12, replies: [] },
    ] },
    { id: 'c2', post: 'p1', author: 'kite', authorNickname: '追风筝的人', authorColors: ['#14b8a6', '#3b82f6'], createdAt: '2 小时前', content: '依赖升级那段深有同感，上次升级 React 大版本，Agent 十分钟列完受影响组件，我花了半小时确认，效率确实高。', likeCount: 54, replies: [] },
    { id: 'c3', post: 'p1', author: 'sugar', authorNickname: '糖糖不爱糖', authorColors: ['#f07848', '#f43f5e'], createdAt: '3 小时前', content: '游戏开发这边体验完全不同，Agent 对引擎 API 的幻觉率还是有点高，文档强的框架好一些。', likeCount: 41, replies: [] },
  ],
  p2: [
    { id: 'c4', post: 'p2', author: 'linwu', authorNickname: '林雾', authorColors: ['#5865e8', '#8b5cf6'], createdAt: '2 小时前', content: '「视线记忆」这个设计成本低效果炸裂，记下了，回头在我们项目里试试。', likeCount: 44, replies: [
      { id: 'c4r1', post: 'p2', author: 'sugar', authorNickname: '糖糖不爱糖', authorColors: ['#f07848', '#f43f5e'], createdAt: '1 小时前', content: '记得把搜索半径调成玩家预期的一半，效果最好。', likeCount: 18, replies: [] },
    ] },
    { id: 'c5', post: 'p2', author: 'yucandie', authorNickname: '余酱', authorColors: ['#e879f9', '#a855f7'], createdAt: '3 小时前', content: '作为玩家证实：怪换个出场方向真的会觉得「它进步了」，心理学的胜利。', likeCount: 33, replies: [] },
  ],
  p10: [
    { id: 'c6', post: 'p10', author: 'moshang', authorNickname: '陌上花开', authorColors: ['#20a779', '#0d9488'], createdAt: '20 小时前', content: '抱一抱。那张纸放在抽屉里，说明你心里其实还有答案，不着急做决定。', likeCount: 210, replies: [] },
    { id: 'c7', post: 'p10', author: 'kite', authorNickname: '追风筝的人', authorColors: ['#14b8a6', '#3b82f6'], createdAt: '19 小时前', content: '「辛苦了」值几个亿。今天也辛苦了。', likeCount: 156, replies: [] },
  ],
}

// ================= 通知 =================
export const notifications: Notification[] = [
  { id: 'm1', category: 'reply', actor: 'linwu', actorNickname: '林雾', actorColors: ['#5865e8', '#8b5cf6'], action: '回复了你的评论', target: '「边界感比模型能力更重要」……', targetUrl: '/p/p1', time: '30 分钟前', read: false },
  { id: 'm2', category: 'like', actor: 'haibao', actorNickname: '海豹摸鱼中', actorColors: ['#e9a23b', '#f97316'], action: '赞了你的帖子', target: '《像素 Roguelike 开发日志 #14》', targetUrl: '/p/p2', time: '1 小时前', read: false },
  { id: 'm3', category: 'follow', actor: 'yucandie', actorNickname: '余酱', actorColors: ['#e879f9', '#a855f7'], action: '关注了你', target: '去看看 TA 的主页', targetUrl: '/u/yucandie', time: '2 小时前', read: false },
  { id: 'm4', category: 'mod', actor: 'sugar', actorNickname: '糖糖不爱糖', actorColors: ['#f07848', '#f43f5e'], action: '将你的帖子加精', target: '《怪物 AI 的三种「假聪明」》', targetUrl: '/p/p2', time: '5 小时前', read: true },
  { id: 'm5', category: 'system', actor: 'admin', actorNickname: 'TalkHub 官方', actorColors: ['#4653d4', '#5865e8'], action: '发布系统公告', target: 'TalkHub 2.0 上线：全新视觉与话题系统', targetUrl: '/', time: '昨天', read: true },
  { id: 'm6', category: 'like', actor: 'nightcat', actorNickname: '夜猫子', actorColors: ['#0ea5e9', '#6366f1'], action: '收藏了你的帖子', target: '《十月新番半程盘点》', targetUrl: '/p/p5', time: '昨天', read: true },
  { id: 'm7', category: 'reply', actor: 'kite', actorNickname: '追风筝的人', actorColors: ['#14b8a6', '#3b82f6'], action: '回复了你的评论', target: '「长距离真的要慢……」', targetUrl: '/p/p9', time: '2 天前', read: true },
  { id: 'm8', category: 'system', actor: 'admin', actorNickname: 'TalkHub 官方', actorColors: ['#4653d4', '#5865e8'], action: '发布系统公告', target: '11 月「城市夜色」摄影活动开启', targetUrl: '/f/photo', time: '11-01', read: true },
]

// 当前登录用户（Mock 会话）
export const currentUser = users[0]!
