<script setup lang="ts">
import { Button, Tag } from '@pixelium/web-vue'
import PostCard from './PostCard.vue'
defineProps<{ eyebrow: string; title: string; description: string; posts: any[]; filters?: { label: string; href: string; count: number }[] }>()
</script>
<template><main id="main" class="listing-shell container"><header class="listing-header"><div class="pixel-label">{{ eyebrow }}</div><h1>{{ title }}</h1><p>{{ description }}</p></header><nav v-if="filters?.length" class="filter-list" aria-label="内容筛选"><Button v-for="filter in filters" :key="filter.href" variant="outline"><a :href="filter.href">{{ filter.label }} · {{ filter.count }}</a></Button></nav><div v-if="posts.length" class="post-card-grid"><PostCard v-for="post in posts" :key="post.id" :post="post" /></div><div v-else class="empty-state"><Tag theme="info">EMPTY</Tag><h2>这里还没有文章</h2><a href="/archive/">查看全部归档</a></div></main></template>
