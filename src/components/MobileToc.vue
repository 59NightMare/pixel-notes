<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card } from '@pixelium/web-vue'
import PixelIcon from './PixelIcon.vue'
withDefaults(defineProps<{ headings: { slug: string; text: string; depth: number }[]; lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const open = ref(false)
</script>

<template>
  <Card class="mobile-toc" :bordered="true">
    <Button variant="text" block :aria-expanded="open" @click="open = !open"><span>{{ lang === 'en' ? 'On this page' : '文章目录' }}</span><PixelIcon :name="open ? 'minus' : 'plus'" :size="16" /></Button>
    <div v-show="open" class="toc-links"><a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`">{{ heading.text }}</a></div>
  </Card>
</template>
