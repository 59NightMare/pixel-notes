<script setup lang="ts">
import { Avatar, Tag } from '@pixelium/web-vue'
import MobileToc from './MobileToc.vue'

type Heading = { slug: string; text: string; depth: number }
type Related = { id: string; title: string } | null
type Article = { title: string; summary: string; category: string; publishedAt: string; updatedAt?: string; readingTime: number; tags: string[]; cover: string; coverAlt: string }

const props = withDefaults(defineProps<{ post: Article; headings: Heading[]; previous: Related; next: Related; lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const isEnglish = props.lang === 'en'
const base = isEnglish ? '/en' : ''
const copy = isEnglish
  ? { home: 'Home', archive: 'Archive', back: 'Back to archive', published: 'Published', updated: 'Updated', read: 'Reading time', minutes: 'min', toc: 'On this page', author: 'A-Che / 阿澈', authorBio: 'Product designer and hobbyist developer writing about interfaces, independent making, and old games.', previous: 'Previous article', next: 'Next article', nav: 'Article navigation', topics: 'Article topics' }
  : { home: '首页', archive: '归档', back: '返回归档', published: '发布', updated: '更新', read: '阅读时间', minutes: '分钟', toc: '文章目录', author: '阿澈 / A-CHE', authorBio: '产品设计师、业余开发者，关注界面、独立创作和旧游戏。', previous: '上一篇', next: '下一篇', nav: '文章导航', topics: '文章主题' }
</script>

<template>
  <main id="main" class="article-shell">
    <article data-pagefind-body>
      <div class="article-topline" data-pagefind-ignore>
        <nav class="article-breadcrumb" :aria-label="isEnglish ? 'Breadcrumb' : '面包屑导航'"><a :href="`${base}/`">{{ copy.home }}</a><span aria-hidden="true">/</span><a :href="`${base}/archive/`">{{ copy.archive }}</a></nav>
        <a class="article-back" :href="`${base}/archive/`">{{ copy.back }} <span aria-hidden="true">↗</span></a>
      </div>
      <header class="article-header">
        <div class="article-kicker" data-pagefind-ignore><Tag theme="warning" size="small">{{ post.category }}</Tag><span>ARTICLE FILE / READ_01</span></div>
        <h1 data-pagefind-meta="title">{{ post.title }}</h1>
        <p class="article-summary">{{ post.summary }}</p>
        <dl class="article-meta" data-pagefind-ignore>
          <div><dt>{{ copy.published }}</dt><dd>{{ post.publishedAt }}</dd></div>
          <div v-if="post.updatedAt"><dt>{{ copy.updated }}</dt><dd>{{ post.updatedAt }}</dd></div>
          <div><dt>{{ copy.read }}</dt><dd>{{ post.readingTime }} {{ copy.minutes }}</dd></div>
        </dl>
        <nav class="article-tags" :aria-label="copy.topics"><a v-for="tag in post.tags" :key="tag" :href="`${base}/tags/${encodeURIComponent(tag)}/`">#{{ tag }}</a></nav>
        <span class="sr-only" data-pagefind-meta="category[content]" :content="post.category"></span>
        <span class="sr-only" data-pagefind-meta="date[content]" :content="post.publishedAt"></span>
      </header>
      <div data-pagefind-ignore><MobileToc :headings="headings" :lang="lang" /></div>
      <figure class="article-figure" data-pagefind-ignore>
        <picture><source :srcset="post.cover.replace(/\.png$/, '.webp')" type="image/webp"><img class="article-cover" :src="post.cover" :alt="post.coverAlt" width="960" height="540"></picture>
        <figcaption><span>FIG.01</span>{{ post.coverAlt }}</figcaption>
      </figure>
      <div class="prose"><slot /></div>
      <nav class="article-nav" :aria-label="copy.nav" data-pagefind-ignore>
        <a v-if="previous" :href="`${base}/posts/${previous.id}/`"><small>← {{ copy.previous }}</small><strong>{{ previous.title }}</strong><i aria-hidden="true">01</i></a>
        <a v-if="next" :href="`${base}/posts/${next.id}/`"><small>{{ copy.next }} →</small><strong>{{ next.title }}</strong><i aria-hidden="true">02</i></a>
      </nav>
    </article>
    <aside class="article-aside" data-pagefind-ignore>
      <nav class="toc" :aria-label="copy.toc"><div class="toc-head"><div><span class="pixel-label">ON THIS PAGE</span><strong>{{ copy.toc }}</strong></div><b>{{ String(headings.length).padStart(2, '0') }}</b></div><div class="toc-links"><a v-for="(heading,index) in headings" :key="heading.slug" :href="`#${heading.slug}`"><span>{{ String(index+1).padStart(2,'0') }}</span>{{ heading.text }}</a></div></nav>
      <a class="author-note" :href="`${base}/about/`"><Avatar shape="square" :size="56" bordered background-color="#ffd166">澈</Avatar><span><strong>{{ copy.author }}</strong><small>{{ copy.authorBio }}</small></span></a>
    </aside>
  </main>
</template>
