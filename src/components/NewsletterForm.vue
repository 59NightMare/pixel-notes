<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@pixelium/web-vue'

const props = defineProps<{ username?: string; compact?: boolean }>()
const email = ref('')
const action = props.username ? `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(props.username)}` : undefined
</script>

<template>
  <section class="newsletter" :class="{ compact }" aria-labelledby="newsletter-title">
    <div>
      <span class="pixel-label">MAIL LOG</span>
      <h2 id="newsletter-title">订阅新文章</h2>
      <p>只发送新文章与重要修订。双重确认，可随时退订。</p>
    </div>
    <form v-if="action" :action="action" method="post" target="_blank">
      <label class="sr-only" for="newsletter-email">邮箱地址</label>
      <Input id="newsletter-email" v-model="email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required />
      <input type="hidden" name="embed" value="1" />
      <Button type="submit" theme="sakura">订阅</Button>
    </form>
    <p v-else class="service-note">邮件通道待配置，当前可使用 <a href="/rss.xml">RSS 订阅</a>。</p>
  </section>
</template>
