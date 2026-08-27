<script setup lang="ts">
import { BackTop } from '@pixelium/web-vue'
import PixelIcon from './PixelIcon.vue'
</script>
<template><BackTop :visibility-height="300" :right="20" :bottom="20"><template #trigger><span aria-label="返回顶部"><PixelIcon name="arrow-up" :size="18" /></span></template></BackTop></template>
