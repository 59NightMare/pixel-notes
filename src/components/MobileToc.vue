<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card } from '@pixelium/web-vue'
defineProps<{ headings: { slug: string; text: string; depth: number }[] }>()
const open = ref(false)
</script>

<template>
  <Card class="mobile-toc" :bordered="true">
    <Button variant="text" block :aria-expanded="open" @click="open = !open"><span>文章目录</span><span>{{ open ? '−' : '＋' }}</span></Button>
    <div v-show="open" class="toc-links"><a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`">{{ heading.text }}</a></div>
  </Card>
</template>
