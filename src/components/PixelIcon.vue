<script setup lang="ts">
import { computed } from 'vue'
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconClose,
  IconCopy,
  IconExternalLink,
  IconMenu,
  IconMinus,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSun
} from '@pixelium/web-vue/icon-pa'

type IconName = 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'close' | 'copy' | 'external-link' | 'menu' | 'minus' | 'moon' | 'plus' | 'search' | 'sun'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 18 })
const icons = {
  'arrow-down': IconArrowDown,
  'arrow-left': IconArrowLeft,
  'arrow-right': IconArrowRight,
  'arrow-up': IconArrowUp,
  close: IconClose,
  copy: IconCopy,
  'external-link': IconExternalLink,
  menu: IconMenu,
  minus: IconMinus,
  moon: IconMoon,
  plus: IconPlus,
  search: IconSearch,
  sun: IconSun
}
const glyph = computed(() => icons[props.name])
</script>

<template>
  <span class="site-icon" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size}px` }" aria-hidden="true"><component :is="glyph" :size="size" /></span>
</template>
