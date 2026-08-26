<script setup lang="ts">
import { Card, Tag } from '@pixelium/web-vue'
defineProps<{ post: { id: string; title: string; summary: string; category: string; publishedAt: string; readingTime: number; tags: string[]; cover: string; coverAlt: string } }>()
</script>
<template><Card class="post-card" bordered><a :href="`/posts/${post.id}/`"><picture><source :srcset="post.cover.replace(/\.png$/, '.webp')" type="image/webp"><img class="post-card-cover" :src="post.cover" :alt="post.coverAlt" width="960" height="540" loading="lazy"></picture><div class="post-card-content"><Tag theme="warning" size="small">{{ post.category }}</Tag><h2>{{ post.title }}</h2><p>{{ post.summary }}</p><div class="meta"><span>{{ post.publishedAt }}</span><span>{{ post.readingTime }} MIN READ</span><span v-if="post.tags[0]">#{{ post.tags[0] }}</span></div></div></a></Card></template>
