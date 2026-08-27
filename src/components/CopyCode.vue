<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@pixelium/web-vue'
import PixelIcon from './PixelIcon.vue'
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(`:root {\n  --paper: #fffaf0;\n  --ink: #171923;\n  --signal: #5ee18f;\n  --action: #ff6b6b;\n}`)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1600)
}
</script>
<template><Button variant="text" size="small" @click="copy"><PixelIcon name="copy" :size="14" />{{ copied ? '已复制' : '复制' }}</Button></template>
