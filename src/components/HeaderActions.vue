<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, useThemeMode } from '@pixelium/web-vue'

const menuOpen = ref(false)
const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const [mode, toggle] = useThemeMode()
const themeSymbol = computed(() => mode.value === 'dark' ? '☀' : '☾')
const labels = computed(() => props.lang === 'en' ? { search: 'Search', dark: 'Switch to dark theme', light: 'Switch to light theme', open: 'Open menu', close: 'Close menu' } : { search: '搜索', dark: '切换到深色主题', light: '切换到浅色主题', open: '打开菜单', close: '关闭菜单' })
const themeLabel = computed(() => mode.value === 'dark' ? labels.value.light : labels.value.dark)
</script>

<template>
  <div class="header-actions">
    <Button class="nav-action" shape="square" variant="outline" :aria-label="labels.search"><a :href="props.lang === 'en' ? '/en/archive/' : '/search/'" :aria-label="labels.search"><span aria-hidden="true">⌕</span></a></Button>
    <Button class="nav-action" shape="square" variant="outline" :aria-label="themeLabel" @click="toggle()"><span aria-hidden="true">{{ themeSymbol }}</span></Button>
    <Button class="nav-action menu-button" shape="square" variant="outline" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="menuOpen ? labels.close : labels.open" @click="menuOpen = !menuOpen"><span aria-hidden="true">{{ menuOpen ? '✕' : '☰' }}</span></Button>
    <nav v-show="menuOpen" id="mobile-nav" class="mobile-panel" aria-label="移动导航">
      <template v-if="props.lang === 'en'"><a href="/en/">Home</a><a href="/en/archive/">Archive</a><a href="/en/about/">About</a></template><template v-else><a href="/">首页</a><a href="/archive/">归档</a><a href="/categories/">分类</a><a href="/tags/">标签</a><a href="/about/">关于</a></template>
    </nav>
  </div>
</template>
