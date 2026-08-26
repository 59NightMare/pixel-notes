---
title: "用 Astro 搭一个真正轻量的内容站"
summary: "把文章留在 Markdown，把交互交给小型岛屿，让内容站在没有复杂后端的情况下保持快速。"
publishedAt: 2026-08-18
category: "技术笔记"
tags: ["Astro", "前端开发", "个人网站"]
featured: true
readingTime: 6
cover: "/images/posts/astro-content-site.png"
ogImage: "/images/og/astro-content-site.png"
coverAlt: "像素窗口中显示静态构建流程"
---

内容博客的核心是稳定的文章地址和低维护成本。Astro 的静态构建让页面默认输出 HTML，只有搜索、主题切换等交互才加载脚本。

## 内容集合

每篇文章都由 schema 检查标题、摘要、日期、分类和标签。错误会在发布前暴露，而不是上线后才被读者发现。

## 小型交互岛

主题切换和 Pixelium 控件使用 Vue，文章正文仍然是静态 HTML。这种边界让组件库服务于体验，而不是接管整个网站。
