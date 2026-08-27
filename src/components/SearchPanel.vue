<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import PixelIcon from './PixelIcon.vue'

type SearchResult = {
  url: string
  excerpt: string
  meta: { title?: string; category?: string; date?: string }
}

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const isEnglish = computed(() => props.lang === 'en')
const query = ref('')
const loading = ref(false)
const ready = ref(false)
const loadFailed = ref(false)
const hasSearched = ref(false)
const results = ref<SearchResult[]>([])
const input = ref<HTMLInputElement | null>(null)
let pagefind: any
let searchSequence = 0
let searchTimer: ReturnType<typeof setTimeout>

const copy = computed(() => isEnglish.value ? {
  label: 'Search articles', placeholder: 'Try “pixel”, “design”, or a category', guidance: 'Enter at least 2 letters or numbers. Search covers titles, summaries, categories, tags, and article content.',
  invalid: 'Please enter at least 2 letters or numbers so the search can find a meaningful match.', loading: 'Searching the article index...', unavailable: 'The search index is temporarily unavailable. Please try again after refreshing the page.',
  initialTitle: 'Ready when you are', initialText: 'Search the notes by an idea, topic, or phrase.', noTitle: 'No matching notes', noText: 'Try a shorter phrase, another spelling, or browse the archive.',
  result: 'result', results: 'results', for: 'for', clear: 'Clear search', open: 'Read article', category: 'Article', index: 'RESULT INDEX', status: 'INDEX READY'
} : {
  label: '搜索文章', placeholder: '试试“像素”“设计”或某个分类', guidance: '请输入至少 2 个字符或数字。可检索标题、摘要、分类、标签与文章正文。',
  invalid: '请输入至少 2 个字符或数字，以便找到有意义的匹配结果。', loading: '正在检索文章索引……', unavailable: '搜索索引暂时不可用，请刷新页面后重试。',
  initialTitle: '检索台已就绪', initialText: '输入一个想法、主题或短语，开始查找文章。', noTitle: '没有找到相关文章', noText: '可以缩短关键词、换一种表述，或前往归档浏览。',
  result: '条结果', results: '条结果', for: '关于', clear: '清除搜索', open: '阅读文章', category: '文章', index: '结果索引', status: '索引就绪'
})

const normalizedQuery = computed(() => query.value.trim())
const validationMessage = computed(() => {
  const value = normalizedQuery.value
  if (!value) return ''
  const compact = value.replace(/\s/g, '')
  if (/^\d$/.test(compact)) return copy.value.invalid
  if (isEnglish.value && compact.length < 2) return copy.value.invalid
  if (!isEnglish.value && compact.length < 2) return copy.value.invalid
  return ''
})
const canSearch = computed(() => ready.value && normalizedQuery.value.length > 0 && !validationMessage.value)

const stopWords = new Set(['一个', '一些', '为什么', '什么', '怎么', '如何', '这个', '那个', '还是', '以及', '已经', '可以', '需要', '值得', '依然'])

function segmentChineseQuery(value: string) {
  if (isEnglish.value) return []
  const normalized = value.replace(/[，。！？、；：,.!?;:"'“”‘’（）()\[\]{}]/g, ' ')
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
    loadFailed.value = true
  }
})

watch(query, () => {
  clearTimeout(searchTimer)
  hasSearched.value = false
  if (!normalizedQuery.value || validationMessage.value) {
    searchSequence++
    loading.value = false
    results.value = []
    return
  }
  searchTimer = setTimeout(search, 180)
})

async function search() {
  if (!canSearch.value) return
  const currentSequence = ++searchSequence
  const fullQuery = normalizedQuery.value
  loading.value = true
  try {
    const primary = await pagefind.search(fullQuery)
    const terms = segmentChineseQuery(fullQuery)
    const shouldExpand = fullQuery.length >= 6 || primary.results.length < 4
    const searchTerms = shouldExpand ? terms.filter((term) => term !== fullQuery) : []
    const expanded = await Promise.all(searchTerms.map((term) => pagefind.search(term)))
    const ranked = new Map<string, { item: any; score: number; matches: number }>()
    const collect = (response: any, weight: number) => response.results.forEach((item: any, index: number) => {
      const existing = ranked.get(item.id)
      const score = weight * (item.score ?? 1) + Math.max(0, 12 - index)
      if (existing) { existing.score += score; existing.matches += 1 }
      else ranked.set(item.id, { item, score, matches: 1 })
    })
    collect(primary, 4)
    expanded.forEach((response) => collect(response, 1))
    const merged = [...ranked.values()].sort((a, b) => b.matches - a.matches || b.score - a.score).slice(0, 12)
    const hydrated = await Promise.all(merged.map(async ({ item }) => await item.data()))
    const meaningfulTerms = [fullQuery, ...terms].filter((term) => term.replace(/\s/g, '').length >= 2)
    const qualified = isEnglish.value ? hydrated : hydrated.filter((result) => {
      const searchableText = `${result.meta?.title ?? ''} ${result.excerpt ?? ''}`.replace(/<[^>]+>/g, '').toLocaleLowerCase('zh-CN')
      return meaningfulTerms.some((term) => searchableText.includes(term.toLocaleLowerCase('zh-CN')))
    })
    if (currentSequence === searchSequence) {
      results.value = qualified
      hasSearched.value = true
    }
  } catch {
    if (currentSequence === searchSequence) loadFailed.value = true
  } finally {
    if (currentSequence === searchSequence) loading.value = false
  }
}

function clearSearch() {
  query.value = ''
  results.value = []
  hasSearched.value = false
  input.value?.focus()
}
</script>

<template>
  <section class="search-panel" :aria-busy="loading">
    <div class="search-console">
      <div class="search-console-head">
        <span>QUERY INPUT</span>
        <span :class="{ offline: loadFailed }"><i aria-hidden="true"></i>{{ loadFailed ? 'INDEX OFFLINE' : (ready ? copy.status : 'INDEX LOADING') }}</span>
      </div>
      <label for="site-search">{{ copy.label }}</label>
      <div class="search-input-row" :class="{ invalid: validationMessage }">
        <span class="search-input-glyph" aria-hidden="true"><PixelIcon name="search" :size="20" /></span>
        <input ref="input" id="site-search" v-model="query" type="search" :placeholder="copy.placeholder" autocomplete="off" spellcheck="false" :aria-invalid="Boolean(validationMessage)" aria-describedby="search-guidance">
        <button v-if="query" class="search-clear" type="button" :aria-label="copy.clear" :title="copy.clear" @click="clearSearch"><PixelIcon name="close" :size="20" /></button>
      </div>
      <p id="search-guidance" class="search-guidance" :class="{ error: validationMessage || loadFailed }">{{ validationMessage || (loadFailed ? copy.unavailable : copy.guidance) }}</p>
    </div>

    <div v-if="canSearch && (loading || hasSearched)" class="search-summary" aria-live="polite">
      <span>{{ copy.index }}</span>
      <strong><q>{{ normalizedQuery }}</q><b v-if="!loading">{{ String(results.length).padStart(2, '0') }} {{ results.length === 1 ? copy.result : copy.results }}</b></strong>
    </div>

    <div v-if="loading" class="search-state search-loading" aria-live="polite">
      <span class="search-loader" aria-hidden="true"><i></i><i></i><i></i></span>
      <div><strong>{{ copy.loading }}</strong><small>{{ normalizedQuery }}</small></div>
    </div>

    <div v-else-if="results.length" class="search-results">
      <a v-for="(result, index) in results" :key="result.url" class="search-result" :href="result.url">
        <small class="search-result-index">{{ String(index + 1).padStart(2, '0') }}</small>
        <div class="search-result-copy">
          <div class="search-result-meta"><span>{{ result.meta.category || copy.category }}</span><time v-if="result.meta.date">{{ result.meta.date }}</time></div>
          <h2>{{ result.meta.title }}</h2>
          <p v-html="result.excerpt"></p>
        </div>
        <span class="search-result-open">{{ copy.open }} <PixelIcon name="external-link" :size="16" /></span>
      </a>
    </div>

    <div v-else-if="hasSearched" class="search-state search-empty" aria-live="polite">
      <span aria-hidden="true">00</span><div><strong>{{ copy.noTitle }}</strong><p>{{ copy.noText }}</p></div>
    </div>
    <div v-else-if="!normalizedQuery" class="search-state search-initial">
      <span aria-hidden="true"><PixelIcon name="search" :size="25" /></span><div><strong>{{ copy.initialTitle }}</strong><p>{{ copy.initialText }}</p></div>
    </div>
  </section>
</template>
