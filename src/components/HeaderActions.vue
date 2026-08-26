<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Button } from '@pixelium/web-vue'

const menuOpen = ref(false)
const props = withDefaults(defineProps<{ lang?: 'zh' | 'en', languageHref?: string }>(), { lang: 'zh', languageHref: '/en/' })
const mode = ref<'light' | 'dark'>('light')
const themeSymbol = computed(() => mode.value === 'dark' ? '☀' : '☾')
const labels = computed(() => props.lang === 'en' ? { search: 'Search', dark: 'Switch to dark theme', light: 'Switch to light theme', open: 'Open menu', close: 'Close menu' } : { search: '搜索', dark: '切换到深色主题', light: '切换到浅色主题', open: '打开菜单', close: '关闭菜单' })
const themeLabel = computed(() => mode.value === 'dark' ? labels.value.light : labels.value.dark)
const openSearch = () => window.location.assign(props.lang === 'en' ? '/en/archive/' : '/search/')
const closeMenuOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
}
const applyTheme = (theme: 'light' | 'dark') => {
  mode.value = theme
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171923' : '#fffaf0')
}
const toggleTheme = () => {
  const nextTheme = mode.value === 'dark' ? 'light' : 'dark'
  applyTheme(nextTheme)
  try {
    localStorage.setItem('pixel-notes-theme', nextTheme)
  } catch {
    // The active page still changes theme when browser storage is unavailable.
  }
}

onMounted(() => {
  mode.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  document.addEventListener('keydown', closeMenuOnEscape)
})

onBeforeUnmount(() => document.removeEventListener('keydown', closeMenuOnEscape))
</script>

<template>
  <div class="header-actions">
    <Button class="nav-action search-action" shape="square" variant="outline" :aria-label="labels.search" @click="openSearch"><span class="search-glyph" aria-hidden="true"></span></Button>
    <Button class="nav-action theme-action" shape="square" variant="outline" :aria-label="themeLabel" @click="toggleTheme"><span class="theme-glyph" aria-hidden="true">{{ themeSymbol }}</span></Button>
    <Button class="nav-action menu-button" shape="square" variant="outline" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="menuOpen ? labels.close : labels.open" @click="menuOpen = !menuOpen"><span aria-hidden="true">{{ menuOpen ? '✕' : '☰' }}</span></Button>
    <nav v-show="menuOpen" id="mobile-nav" class="mobile-panel" aria-label="移动导航">
      <template v-if="props.lang === 'en'"><a href="/en/">Home</a><a href="/en/archive/">Archive</a><a href="/en/about/">About</a></template><template v-else><a href="/">首页</a><a href="/archive/">归档</a><a href="/categories/">分类</a><a href="/tags/">标签</a><a href="/about/">关于</a></template>
      <a class="mobile-only-setting" :href="props.languageHref">{{ props.lang === 'en' ? '中文' : 'English' }}<span aria-hidden="true">↗</span></a>
      <button class="mobile-only-setting" type="button" @click="toggleTheme">{{ themeLabel }}<span aria-hidden="true">{{ themeSymbol }}</span></button>
    </nav>
  </div>
</template>
