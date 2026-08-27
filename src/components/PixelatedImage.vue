<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { pixelateImage } from '@pixelium/web-vue'

const props = withDefaults(defineProps<{
  src: string
  webpSrc?: string
  alt: string
  width: number
  height: number
  pixelSize?: number
  loading?: 'eager' | 'lazy'
}>(), {
  webpSrc: undefined,
  pixelSize: 8,
  loading: 'lazy'
})

const image = ref<HTMLImageElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)
let renderId = 0

async function renderPixelatedImage() {
  const currentImage = image.value
  const currentCanvas = canvas.value
  if (!currentImage || !currentCanvas || !currentImage.complete || currentImage.naturalWidth === 0) return

  const requestId = ++renderId
  ready.value = false

  try {
    const imageData = await pixelateImage(currentImage, props.pixelSize)
    if (!imageData || requestId !== renderId) return

    currentCanvas.width = imageData.width
    currentCanvas.height = imageData.height
    currentCanvas.getContext('2d')?.putImageData(imageData, 0, 0)
    ready.value = true
  } catch {
    ready.value = false
  }
}

onMounted(renderPixelatedImage)
onBeforeUnmount(() => { renderId++ })
watch(() => [props.src, props.webpSrc, props.pixelSize], renderPixelatedImage)
</script>

<template>
  <span class="pixelated-image" :class="{ 'is-pixelated': ready }">
    <picture>
      <source v-if="webpSrc" :srcset="webpSrc" type="image/webp">
      <img ref="image" :src="src" :alt="alt" :width="width" :height="height" :loading="loading" decoding="async" @load="renderPixelatedImage">
    </picture>
    <canvas ref="canvas" class="pixelated-image-canvas" aria-hidden="true"></canvas>
  </span>
</template>
