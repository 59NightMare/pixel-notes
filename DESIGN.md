# Design

## Source of truth

- Status: Active
- Last refreshed: 2026-08-26
- Primary product surfaces: 中英文首页、文章详情、订阅、评论、CMS、离线页、移动导航与归档入口。
- Evidence reviewed: 现有 Astro/Pixelium 实现、Buttondown、giscus、Cloudflare Web Analytics、Sveltia CMS 官方文档。
- Assumptions: 个人内容型博客；中文为主、英文为完整镜像；外部账号未配置时必须显示真实的待配置状态。

## Brand

- Personality: 好奇、克制、亲近，带有 90 年代桌面系统与掌机游戏的记忆。
- Trust signals: 清晰作者身份、真实发布日期/更新时间、稳定文章链接、可读正文、公开 RSS。
- Avoid: 低对比霓虹、整页像素字体、过度动画、玻璃拟态、大圆角、营销式巨型口号。

## Product goals

- Goals: 让读者快速判断博客主题；轻松发现文章；获得舒适、专注的长文阅读体验。
- Non-goals: 不自建邮箱、评论身份、访问分析或 OAuth 数据库；不建设会员、即时聊天和实时协作编辑器。
- Success signals: 文章进入率、阅读完成率、订阅确认率、评论质量、中英文切换率、离线回访率。

## Personas and jobs

- Primary personas: 通过搜索或分享首次进入的读者；持续关注作者的老读者；维护内容的站长。
- User jobs: 判断是否值得阅读；按主题发现内容；连续阅读相关文章；稳定发布与修订文章。
- Key contexts of use: 桌面端深度阅读；移动端碎片阅读；搜索引擎直达文章页。

## Information architecture

- Primary navigation: 中文为首页、归档、分类、标签、关于；英文为 Home、Archive、About；右侧为语言、搜索与主题切换。
- Core routes/screens: `/`、`/posts/[slug]`、`/en/`、`/en/posts/[slug]`、`/archive`、`/privacy`、`/offline`、`/admin`、`/404`。
- Content hierarchy: 品牌与导航 -> 精选/最新内容 -> 主题入口 -> 作者信息；文章页以标题和正文优先。

## Design principles

- 像素语言贯穿全部内容：标题、正文、导航、目录与代码统一使用 Fusion Pixel，并通过字号、行距和内容宽度保持可读性。
- 像桌面工具一样清晰：边界、状态与层级直接可见，避免装饰性容器堆叠。
- 内容先于气氛：首屏立即出现真实文章与主题，视觉场景只负责建立品牌记忆。
- 小而有反馈：按钮按压、复制成功与主题切换有短促反馈，并支持减少动态效果。
- Tradeoffs: 牺牲部分“纯复古”真实性，换取现代可访问性、移动体验与搜索可发现性。

## Visual language

- Color: 墨黑 `#171923`、纸白 `#fffaf0`、电光绿 `#5ee18f`、珊瑚红 `#ff6b6b`、天蓝 `#65b7ff`、日光黄 `#ffd166`。深浅主题保持稳定语义。
- Typography: 所有可见内容统一使用 Pixelium 自带的 `Fusion Pixel Zh_hans`，包含品牌、导航、按钮、标题、摘要、正文、目录、元信息和代码。
- Spacing/layout rhythm: 以 4px 为基础，主要节奏为 8/12/16/24/32/48px；内容最大宽度 1120px，正文 720px。
- Shape/radius/elevation: 0-4px 圆角；2px 硬边框；4px 硬阴影；不使用模糊阴影。
- Motion: 120-180ms 的整数像素位移；不循环漂浮；减少动态效果时全部停用。
- Imagery/iconography: CSS 像素桌面场景、8-bit 缩略图、Lucide 功能图标；色块同时配文字。

## Components

- Existing components to reuse: Pixelium `Button`、`Link`、`Tag`、`Card`、`Row`、`Col`、`Divider`、`Breadcrumb`、`Avatar`、`BackTop`。
- New/changed components: `NewsletterForm`、`Comments`、语言切换、PWA 注册、离线页和 CMS 管理入口；沿用现有 Pixelium 控件与硬边框语言。
- Variants and states: 默认/悬停/聚焦/按下/禁用；外部服务增加未配置、加载、成功和服务端错误状态。
- Token/component ownership: 通用组件外观和交互由 Pixelium 变量与组件管理；博客色彩、正文节奏和场景插画由 `styles.css` 的 `--blog-*` 变量管理。

## Accessibility

- Target standard: WCAG 2.1 AA。
- Keyboard/focus behavior: 保留自然 Tab 顺序；所有操作控件具有高对比 3px 焦点框；移动菜单可键盘关闭。
- Contrast/readability: 正文对比度至少 4.5:1；遵循全站 Fusion Pixel 视觉要求，通过字号、行高和约 68 个中文字符的行宽维持可读性。
- Screen-reader semantics: 语义化导航、主内容、文章、标题层级；图标按钮均有可访问名称。
- Reduced motion and sensory considerations: 遵循 `prefers-reduced-motion`；颜色不作为唯一状态信号。

## Responsive behavior

- Supported breakpoints/devices: 360px 起；移动端 `<768px`；桌面端 `>=768px`；增强布局 `>=1100px`。
- Layout adaptations: 首页双栏变单栏；桌面文章目录固定于右侧，移动端折叠为目录按钮；导航变抽屉。
- Touch/hover differences: 触控目标至少 44px；触摸设备不依赖 hover 显示关键信息。

## Interaction states

- Loading: 列表使用固定高度像素条占位，避免布局跳动。
- Empty: 提供一句说明和返回全部文章入口。
- Error: 用高对比红色边框与明确恢复操作，不只显示错误代码。
- Success: 复制、主题切换使用 2 秒以内的文本反馈。
- Disabled: 降低对比并移除硬阴影，同时保留文字标签。
- Offline/slow network: 核心壳层预缓存；文章访问后缓存，最多 30 个页面；后台和第三方评论不缓存；离线时提供明确恢复入口。

## Content voice

- Tone: 直接、具体、诚实，像作者在工作台边分享近期发现。
- Terminology: 使用“文章”“归档”“主题”“阅读时间”，避免不必要的英文产品术语。
- Microcopy rules: 按钮以动词开头；空状态给出下一步；不使用夸张宣传语。

## Implementation constraints

- Framework/styling system: Astro 7 + TypeScript + Vue islands + `@pixelium/web-vue@0.2.0-beta`；内容为 Markdown/MDX。
- Design-token constraints: Pixelium 版本精确锁定；优先按需导入；通用控件直接使用组件库，博客业务层只扩展排版和品牌变量。
- Performance constraints: 静态 HTML 优先；首屏 JS 小于 40KB gzip；LCP 目标 <=2.5s；CLS <=0.1。
- Compatibility constraints: 当前及前一版本 Chrome、Edge、Firefox、Safari；当前 iOS Safari 与 Android Chrome；service worker 仅在支持时渐进增强。
- Test/screenshot expectations: 1440x900、768x1024、390x844 三组截图；键盘导航、主题、抽屉与正文溢出检查。

## Open questions

- [ ] 正式站名与作者名 / 站长 / 影响品牌文案与域名
- [ ] 是否已有旧文章与 URL / 站长 / 影响迁移与重定向
- [ ] 正式域名与 Cloudflare Pages 项目 / 站长 / 影响 `SITE_URL`、giscus 来源与分析
- [ ] Buttondown 用户名 / 站长 / 启用真实邮件订阅
- [ ] GitHub 仓库与 giscus ID / 站长 / 启用 CMS 登录、评论与审核
