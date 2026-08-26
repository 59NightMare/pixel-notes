<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const online = ref(true)
const changed = ref(false)
let timer: ReturnType<typeof setTimeout>

function update() {
  online.value = navigator.onLine
  changed.value = true
  clearTimeout(timer)
  if (online.value) timer = setTimeout(() => { changed.value = false }, 2400)
}

onMounted(() => {
  online.value = navigator.onLine
  window.addEventListener('online', update)
  window.addEventListener('offline', update)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', update)
  window.removeEventListener('offline', update)
  clearTimeout(timer)
})
</script>

<template><div v-if="!online || changed" class="connection-status" :class="{ online }" role="status"><i></i>{{ online ? '网络已恢复' : '离线阅读模式' }}</div></template>
