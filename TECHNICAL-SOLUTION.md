# Pixel Notes 技术方案

## 1. 已确定方案

| 项目 | 选择 | 原因 |
| --- | --- | --- |
| 站点框架 | Astro 7 + TypeScript + Vue islands | 静态内容优先，仅为交互组件加载 Vue |
| UI 组件库 | `@pixelium/web-vue@0.2.0-beta`（精确锁定） | 直接使用其像素组件、主题、字体与响应式能力；beta 版本需控制升级 |
| 内容格式 | Markdown/MDX + Git | 可审阅、可回滚、可迁移，无数据库维护成本 |
| 样式 | Pixelium 主题变量 + 博客业务 CSS | 通用交互由组件库管理，文章排版与品牌场景保持业务可控 |
| 搜索 | Pagefind 构建时索引 | 静态部署、中文可检索、无需第三方服务 |
| 图片 | Sharp 构建脚本 + 素材登记表 | 像素图使用无损 PNG/WebP，固定尺寸并在构建前校验版权信息 |
| 部署 | Cloudflare Pages 为默认，Vercel 为备选 | 自动预览、全球 CDN、HTTPS 和低成本 |
| 分析 | Cloudflare Web Analytics | Cloudflare 自动注入优先，无跨站跟踪 Cookie；手动 beacon 仅作备选 |
| 评论 | giscus + GitHub Discussions | GitHub 身份、举报与审核，不在本站保存账号数据 |
| 订阅 | Buttondown 原生表单 + RSS | 双重确认与退订由服务商处理，无本站邮件数据库 |
| 多语言 | 独立 `posts` / `postsEn` 内容集合 | 中英文章一一对应，可独立校订并生成 `hreflang` |
| CMS | Sveltia CMS + GitHub editorial workflow | 可视化编辑生成分支/PR，Markdown 仍是内容源 |
| PWA | Web Manifest + 原生 Service Worker | 核心壳层预缓存，访问后的文章可离线阅读 |

## 2. 内容工作流

```text
创建文章草稿
  -> 填写 frontmatter 与正文
  -> 本地预览和拼写/链接检查
  -> 提交分支并生成预览地址
  -> 内容与视觉检查
  -> 合并主分支
  -> 自动构建、生成搜索索引/RSS/站点地图
  -> 部署生产环境
  -> 自动检查关键 URL
```

### 文章目录约定

```text
src/content/posts/
  2026-08-pixel-design.md
public/images/posts/
  pixel-design/
    cover.png
    diagram-01.png
```

### Frontmatter 示例

```yaml
---
title: "把限制变成风格：我的像素设计笔记"
slug: "pixel-design-notes"
summary: "从有限色板、整数网格到清晰反馈，记录像素风界面的五个实践原则。"
publishedAt: 2026-08-26
updatedAt: 2026-08-26
category: "设计观察"
tags: ["像素设计", "界面", "可访问性"]
cover: "/images/posts/pixel-design/cover.png"
coverAlt: "像素风工作台，显示器中打开一张界面网格"
featured: true
status: "published"
---
```

### 分类与标签规范

- 分类固定为：`技术笔记`、`设计观察`、`游戏与像素`、`随笔`。
- 标签固定为：`像素设计`、`前端开发`、`Astro`、`界面设计`、`游戏设计`、`写作`、`知识管理`、`个人网站`。
- 新分类或标签必须先加入 `src/config/taxonomy.ts`，再用于文章；内容 schema 会阻止同义词和临时标签进入构建。

### 自动校验

- 构建时校验必填字段、日期格式、唯一 slug、分类合法性和封面替代文本。
- CI 检查 Markdown、内部链接、图片引用、HTML 可访问性与 Astro 构建。
- `src/data/assets.json` 登记素材来源、作者、许可、用途、替代文本和尺寸；`npm run assets:validate` 会检查登记完整性、文件尺寸与 WebP 变体。
- `npm run assets:generate` 可重复生成项目自有像素封面，使用 nearest-neighbor 友好的整数几何与无损编码。
- 草稿仅在本地和预览环境可见；生产构建过滤 `draft`。

## 3. 部署架构

```text
Git 仓库
  -> Pull Request 预览环境
  -> 主分支合并
  -> Cloudflare Pages 构建
  -> Astro 静态文件 + Pagefind 索引
  -> CDN / HTTPS / 自定义域名
```

- 生产分支：`main`；预览环境：每个 Pull Request 自动生成独立 URL。
- Cloudflare Pages 必须配置环境变量 `SITE_URL=https://正式域名`；Astro、RSS、Sitemap、canonical 与 Open Graph 共用该值，生产构建缺失时会直接失败，避免发布占位域名。
- 构建命令：`npm run build`；发布目录：`dist/`。
- `public/_redirects` 保留旧 `/article` 地址的 301 跳转。Cloudflare Pages 会自动把静态 `404.html` 用于未匹配路径并返回 404；不要配置 `/* /index.html 200`，它会破坏正确状态码。
- 环境变量只存站点地址、分析或未来邮件服务配置，正文不依赖环境密钥。
- DNS、域名和部署项目归属站长账号，并开启双重认证。
- 每周镜像仓库与原始图片至独立备份位置；季度进行一次恢复演练。

## 4. 推荐目录结构

```text
src/
  components/
  content/posts/
  layouts/
  pages/
  styles/
public/
  fonts/
  images/
tests/
  e2e/
astro.config.mjs
```

## 5. 质量门槛

- CI：格式检查、类型检查、构建、链接检查、关键页面端到端测试。
- Lighthouse：性能 >=85、可访问性 >=90、SEO >=90。
- 页面验证尺寸：1440x900、768x1024、390x844。
- 文章页必须在无客户端 JavaScript 时仍可阅读和导航。
- 发布失败不得替换当前生产版本；部署平台保留可回滚版本。

## 6. 图片发布流程

1. 原图先确认作者、来源和许可；无法确认授权的图片不进入仓库。
2. 在 `src/data/assets.json` 登记用途、替代文本、尺寸和衍生关系。
3. 像素图保持整数倍缩放，PNG 作为清晰回退，WebP 作为优先加载格式。
4. 执行 `npm run assets:validate`，再执行完整构建。
5. 项目生成的封面使用 `CC BY 4.0`；第三方素材必须保留其原始许可，不得统一改写。

## 7. P1 演进

- 内容规模超过约 1000 篇或需要复杂中文分词时，再评估托管搜索服务。
- 多编辑者 CMS：部署 Sveltia CMS Authenticator 到 Cloudflare Workers，OAuth secret 仅存 Worker secret。

## 8. 外部服务上线清单

1. Buttondown：设置 `PUBLIC_BUTTONDOWN_USERNAME`；表单使用原生 POST 和 `embed=1`，不要改为 `fetch`。
2. giscus：公开 GitHub 仓库、开启 Discussions、安装 giscus App，从 giscus.app 获取四个 ID；将 `giscus.json` 的正式来源换成真实域名。
3. Cloudflare Web Analytics：优先在 Dashboard 为正式 hostname 开启自动注入；启用后保持 `PUBLIC_CF_WEB_ANALYTICS_TOKEN` 为空，避免重复 beacon。
4. Sveltia CMS：将 `public/admin/config.yml` 的 `owner/pixel-notes` 换成真实仓库。单人可在登录页使用细粒度 PAT；多人使用 Cloudflare Worker OAuth，不把 token 或 secret 写入仓库。
5. PWA：每次调整缓存策略时更新 `VERSION`；CMS、外部评论和跨域请求不得进入缓存。
