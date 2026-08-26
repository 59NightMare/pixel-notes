<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Input, Spin } from '@pixelium/web-vue'
const query = ref('')
const loading = ref(false)
const ready = ref(false)
const results = ref<any[]>([])
let pagefind: any

onMounted(async () => {
  try {
    pagefind = await import(/* @vite-ignore */ '/pagefind/pagefind.js')
    await pagefind.init()
    ready.value = true
  } catch {
    ready.value = false
  }
})

async function search() {
  if (!ready.value || !query.value.trim()) { results.value = []; return }
  loading.value = true
  const response = await pagefind.search(query.value)
  results.value = await Promise.all(response.results.slice(0, 12).map((item: any) => item.data()))
  loading.value = false
}
</script>
<template><section class="search-panel"><label for="site-search">搜索文章</label><Input id="site-search" v-model="query" placeholder="输入标题、正文、分类或标签" @input="search" /><p v-if="!ready" class="search-note">搜索索引仅在生产构建后可用。</p><Spin v-if="loading" /><div v-else-if="results.length" class="search-results" aria-live="polite"><a v-for="result in results" :key="result.url" :href="result.url"><h2>{{ result.meta.title }}</h2><p v-html="result.excerpt"></p></a></div><p v-else-if="query && ready" class="search-note">没有找到匹配文章。</p></section></template>
