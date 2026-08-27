<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from '@pixelium/web-vue'
import PixelIcon from './PixelIcon.vue'

const props = withDefaults(defineProps<{ username?: string; compact?: boolean; lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const email = ref('')
const action = props.username ? `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(props.username)}` : undefined
</script>

<template>
  <section class="newsletter" :class="{ compact }" aria-labelledby="newsletter-title">
    <div class="newsletter-copy">
      <span class="pixel-label">MAIL LOG</span>
      <h2 id="newsletter-title">{{ props.lang === 'en' ? 'Follow new articles' : '订阅新文章' }}</h2>
      <p>{{ props.lang === 'en' ? 'New writing and major revisions only. Double opt-in, unsubscribe anytime.' : '只发送新文章与重要修订。双重确认，可随时退订。' }}</p>
    </div>
    <form v-if="action" :action="action" method="post" target="_blank">
      <label class="sr-only" for="newsletter-email">{{ props.lang === 'en' ? 'Email address' : '邮箱地址' }}</label>
      <Input id="newsletter-email" v-model="email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required />
      <input type="hidden" name="embed" value="1" />
      <Button type="submit" theme="sakura">{{ props.lang === 'en' ? 'Subscribe' : '订阅' }}</Button>
    </form>
    <p v-else class="service-note">
      <span>{{ props.lang === 'en' ? 'Email subscription is not open yet' : '邮件订阅暂未开放' }}</span>
      <a class="newsletter-rss" href="/rss.xml">{{ props.lang === 'en' ? 'Follow via RSS' : '通过 RSS 关注' }} <PixelIcon name="arrow-right" :size="17" /></a>
    </p>
  </section>
</template>
