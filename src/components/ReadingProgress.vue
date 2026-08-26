<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)

function updateProgress() {
  const article = document.querySelector('article')
  if (!article) return
  const rect = article.getBoundingClientRect()
  const total = Math.max(1, article.scrollHeight - window.innerHeight)
  progress.value = Math.min(100, Math.max(0, (-rect.top / total) * 100))
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template><div class="reading-progress" aria-hidden="true"><span :style="{ width: `${progress}%` }"></span></div></template>
