<script setup lang="ts">
import { Card, Tag } from '@pixelium/web-vue'
import PixelatedImage from './PixelatedImage.vue'
withDefaults(defineProps<{ post: { id: string; title: string; summary: string; category: string; publishedAt: string; readingTime: number; tags: string[]; cover: string; coverAlt: string }; lang?: 'zh' | 'en' }>(), { lang: 'zh' })
</script>
<template>
  <Card class="post-card" bordered>
    <a class="post-card-link" :href="`${lang === 'en' ? '/en' : ''}/posts/${post.id}/`">
      <div class="post-card-media">
        <PixelatedImage class="post-card-cover" :src="post.cover" :webp-src="post.cover.replace(/\.png$/, '.webp')" :alt="post.coverAlt" :width="960" :height="540" :pixel-size="8" />
      </div>
      <div class="post-card-content">
        <div class="post-card-topline"><Tag theme="warning" size="small">{{ post.category }}</Tag><span>{{ post.publishedAt }}</span></div>
        <h2>{{ post.title }}</h2>
        <p>{{ post.summary }}</p>
        <div class="post-card-bottom"><div class="meta"><span>{{ post.readingTime }} MIN READ</span><span v-if="post.tags[0]">#{{ post.tags[0] }}</span></div><span class="post-card-open">{{ lang === 'en' ? 'Read article' : '阅读文章' }} <i aria-hidden="true">↗</i></span></div>
      </div>
    </a>
  </Card>
</template>
