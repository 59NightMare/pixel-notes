# Pixel Notes

Pixel Notes 是一个基于 Astro、Vue、Pixelium 和 Pagefind 构建的双语像素风个人博客。项目以静态页面为主，支持中英文内容、分类与标签、全文搜索、暗色主题、RSS、PWA 离线访问，以及基于 Sveltia CMS 的 Git 内容管理。

## 功能

- 中文与英文首页、文章、归档、分类、标签、关于和搜索页面
- Fusion Pixel 像素字体与 Pixelium UI 控件
- 响应式布局和跨页面持久化的明暗主题
- Markdown 内容集合和自定义分类、标签
- Pagefind 中英文静态全文搜索
- RSS、Sitemap、Open Graph 和 Twitter Card
- PWA Manifest、Service Worker 和离线页面
- Sveltia CMS 文章管理入口
- 可选的 Buttondown 邮件订阅、Giscus 评论和 Cloudflare Web Analytics

## 技术栈

- Astro 7
- Vue 3
- TypeScript
- `@pixelium/web-vue`
- Pagefind
- Sveltia CMS
- Sharp

## 环境要求

- Node.js 22 或更新版本
- npm 10 或更新版本
- Git

## 本地运行

安装依赖：

```bash
npm install
```

启动 Astro 开发服务器：

```bash
npm run dev
```

默认访问地址为 `http://127.0.0.1:4321/`。

生产构建：

```bash
SITE_URL=https://your-domain.example npm run build
```

PowerShell：

```powershell
$env:SITE_URL='https://your-domain.example'
npm run build
```

预览生产构建：

```bash
npm run preview
```

## CMS

CMS 页面位于 `/admin/`，配置文件为 `public/admin/config.yml`。

当前 GitHub 后端：

```yaml
backend:
  name: github
  repo: 59NightMare/pixel-notes
  branch: master
```

### 本地仓库模式

请使用支持 File System Access API 的 Chrome 或 Edge 打开 CMS，然后选择项目根目录。Codex 内置浏览器无法完成系统目录授权。

如果前台使用 `dist` 静态服务，可同时启动内容监听器：

```bash
npm run cms:watch
```

监听器会在 CMS 修改 `src/content` 或上传文章图片后自动重新构建。构建完成后刷新前台即可看到变化。

### GitHub 模式

正式部署时可使用 GitHub OAuth 或访问令牌登录。CMS 保存内容后会提交到 `master`，再由部署平台触发静态站点构建。

## 内容结构

```text
src/content/posts/       中文文章
src/content/posts-en/    英文文章
public/images/posts/     文章封面
public/images/og/        分享图片
```

文章使用 Markdown 和 YAML frontmatter：

```yaml
---
title: "文章标题"
summary: "20 到 180 个字符的文章摘要"
publishedAt: 2026-08-27
category: "自定义分类"
tags: ["标签一", "标签二"]
featured: false
draft: false
readingTime: 5
cover: "/images/posts/example.webp"
coverAlt: "封面图片说明"
---
```

分类和标签支持自定义。每篇文章只能有一个分类，最多包含 5 个标签。新分类和标签会在构建时自动生成对应页面。

## 环境变量

| 变量 | 必需 | 用途 |
| --- | --- | --- |
| `SITE_URL` | 生产环境必需 | Canonical、Sitemap、RSS 和分享链接域名 |
| `PUBLIC_BUTTONDOWN_USERNAME` | 可选 | 启用 Buttondown 邮件订阅 |
| `PUBLIC_CF_WEB_ANALYTICS_TOKEN` | 可选 | 启用 Cloudflare Web Analytics 脚本 |
| `PUBLIC_GISCUS_REPO` | 可选 | Giscus 仓库名 |
| `PUBLIC_GISCUS_REPO_ID` | 可选 | Giscus 仓库 ID |
| `PUBLIC_GISCUS_CATEGORY` | 可选 | GitHub Discussions 分类名 |
| `PUBLIC_GISCUS_CATEGORY_ID` | 可选 | GitHub Discussions 分类 ID |

未配置可选服务时，构建仍会成功，界面会显示对应的待配置状态。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Astro 开发服务器 |
| `npm run build` | 校验配置与素材，构建站点并生成 Pagefind 索引 |
| `npm run preview` | 预览生产构建 |
| `npm run cms:watch` | 监听 CMS 内容变化并自动构建 |
| `npm run assets:generate` | 生成项目图片素材 |
| `npm run assets:validate` | 校验素材清单和优化版本 |
| `npm run config:check` | 检查第三方服务配置状态 |

## 部署

项目输出目录为 `dist`，可部署到 Cloudflare Pages、GitHub Pages、Netlify 或其他静态托管平台。

推荐构建配置：

```text
Build command: npm run build
Output directory: dist
```

部署平台需要设置真实的 `SITE_URL`。如果使用 Cloudflare Pages，还应确认自定义 404、静态资源缓存和 Service Worker 更新策略。

## Git 工作流

主要开发与 CMS 发布分支为 `master`：

```bash
git add .
git commit -m "描述本次修改"
git push origin master
```

远程仓库：<https://github.com/59NightMare/pixel-notes>

## 许可证

当前仓库尚未声明开源许可证。除非仓库后续增加许可证文件，否则代码和内容默认保留所有权利。
