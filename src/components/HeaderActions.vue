<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, useThemeMode } from '@pixelium/web-vue'

const menuOpen = ref(false)
const [mode, toggle] = useThemeMode()
const themeLabel = computed(() => mode.value === 'dark' ? '切换到浅色主题' : '切换到深色主题')
const themeSymbol = computed(() => mode.value === 'dark' ? '☀' : '☾')
</script>

<template>
  <div class="header-actions">
    <Button class="nav-action" shape="square" variant="outline" aria-label="搜索"><a href="/search/" aria-label="搜索"><span aria-hidden="true">⌕</span></a></Button>
    <Button class="nav-action" shape="square" variant="outline" :aria-label="themeLabel" @click="toggle()"><span aria-hidden="true">{{ themeSymbol }}</span></Button>
    <Button class="nav-action menu-button" shape="square" variant="outline" :aria-expanded="menuOpen" aria-controls="mobile-nav" :aria-label="menuOpen ? '关闭菜单' : '打开菜单'" @click="menuOpen = !menuOpen"><span aria-hidden="true">{{ menuOpen ? '✕' : '☰' }}</span></Button>
    <nav v-show="menuOpen" id="mobile-nav" class="mobile-panel" aria-label="移动导航">
      <a href="/">首页</a><a href="/archive/">归档</a><a href="/categories/">分类</a><a href="/tags/">标签</a><a href="/about/">关于</a>
    </nav>
  </div>
</template>
