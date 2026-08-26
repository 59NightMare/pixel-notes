<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Input, Spin } from '@pixelium/web-vue'
const query = ref('')
const loading = ref(false)
const ready = ref(false)
const results = ref<any[]>([])
const searchedTerms = ref<string[]>([])
let pagefind: any
let searchSequence = 0
let searchTimer: ReturnType<typeof setTimeout>

const stopWords = new Set(['一个', '一些', '为什么', '什么', '怎么', '如何', '这个', '那个', '还是', '以及', '已经', '可以', '需要', '值得', '依然'])

function segmentChineseQuery(value: string) {
  const normalized = value.trim().replace(/[，。！？、；：,.!?;:"'“”‘’（）()\[\]{}]/g, ' ')
  const tokens = new Set<string>()
  const Segmenter = (Intl as any).Segmenter

  if (Segmenter) {
    const segmenter = new Segmenter('zh-CN', { granularity: 'word' })
    for (const item of segmenter.segment(normalized)) {
      const term = item.segment.trim()
      if (item.isWordLike && term.length >= 2 && !stopWords.has(term)) tokens.add(term)
    }
  }

  for (const phrase of normalized.split(/\s+/)) {
    if (phrase.length >= 2 && phrase.length <= 8 && !stopWords.has(phrase)) tokens.add(phrase)
  }

  return [...tokens].slice(0, 6)
}

onMounted(async () => {
  try {
    pagefind = await import(/* @vite-ignore */ '/pagefind/pagefind.js')
    await pagefind.init()
    ready.value = true
  } catch {
    ready.value = false
  }
})

watch(query, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(search, 180)
})

async function search() {
  const currentSequence = ++searchSequence
  const fullQuery = query.value.trim()
  if (!ready.value || !fullQuery) { results.value = []; searchedTerms.value = []; return }
  loading.value = true
  try {
    const primary = await pagefind.search(fullQuery)
    const terms = segmentChineseQuery(fullQuery)
    const shouldExpand = fullQuery.length >= 6 || primary.results.length < 4
    const searchTerms = shouldExpand ? terms : []
    const expanded = await Promise.all(searchTerms.map((term) => pagefind.search(term)))
    const ranked = new Map<string, { item: any; score: number; matches: Set<string> }>()

    const collect = (response: any, term: string, weight: number) => {
      response.results.forEach((item: any, index: number) => {
        const existing = ranked.get(item.id)
        const score = weight * (item.score ?? 1) + Math.max(0, 12 - index)
        if (existing) {
          existing.score += score
          existing.matches.add(term)
        } else {
          ranked.set(item.id, { item, score, matches: new Set([term]) })
        }
      })
    }

    collect(primary, fullQuery, 4)
    expanded.forEach((response, index) => collect(response, searchTerms[index], 1))
    const merged = [...ranked.values()].sort((a, b) => b.matches.size - a.matches.size || b.score - a.score).slice(0, 12)
    const hydrated = await Promise.all(merged.map(async ({ item, matches }) => ({ ...(await item.data()), matchedTerms: [...matches] })))

    if (currentSequence === searchSequence) {
      results.value = hydrated
      searchedTerms.value = searchTerms
    }
  } finally {
    if (currentSequence === searchSequence) loading.value = false
  }
}
</script>
<template><section class="search-panel"><label for="site-search">搜索文章</label><Input id="site-search" v-model="query" placeholder="输入标题、正文、分类或标签" /><p v-if="!ready" class="search-note">搜索索引仅在生产构建后可用。</p><p v-else-if="searchedTerms.length" class="search-terms">已扩展检索：<span v-for="term in searchedTerms" :key="term">{{ term }}</span></p><Spin v-if="loading" /><div v-else-if="results.length" class="search-results" aria-live="polite"><a v-for="result in results" :key="result.url" :href="result.url"><h2>{{ result.meta.title }}</h2><p v-html="result.excerpt"></p><small v-if="result.matchedTerms?.length">命中：{{ result.matchedTerms.join(' · ') }}</small></a></div><p v-else-if="query && ready" class="search-note">没有找到匹配文章。</p></section></template>
