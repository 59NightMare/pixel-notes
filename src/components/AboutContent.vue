<script setup lang="ts">
import { Avatar, Tag } from '@pixelium/web-vue'

const props = withDefaults(defineProps<{ lang?: 'zh' | 'en' }>(), { lang: 'zh' })
const isEnglish = props.lang === 'en'

const content = isEnglish
  ? {
      label: 'ABOUT / PROFILE_01',
      title: 'Hello, I am A-Che.',
      intro: 'A product designer, hobbyist developer, and someone learning to explain problems clearly.',
      facts: [['ROLE', 'Product designer'], ['BASE', 'Shanghai'], ['NOTES', 'Design / Code / Games']],
      storyLabel: 'AUTHOR LOG',
      storyTitle: 'A small workshop for ideas in progress.',
      story: [
        'Pixel Notes is where I document interfaces, code, old games, and independent making. I write to turn half-formed observations into ideas that can be revisited and used.',
        'The site is built with Pixelium and Fusion Pixel. Articles stay in portable Markdown, so the writing remains independent from any single publishing platform.',
      ],
      topicsLabel: 'WRITING ABOUT',
      topicsAria: 'Writing topics',
      topics: ['Interface design', 'Frontend', 'Pixel art', 'Personal web'],
      connectLabel: 'SIGNAL PORTS',
      connectTitle: 'Contact & follow',
      connectCopy: 'Pick the channel that suits you. RSS is the most reliable way to follow new writing.',
      links: [
        { code: '01', label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
        { code: '02', label: 'RSS feed', value: 'Follow updates', href: '/rss.xml' },
        { code: '03', label: 'GitHub', value: 'Code & projects', href: 'https://github.com/' },
      ],
    }
  : {
      label: 'ABOUT / PROFILE_01',
      title: '你好，我是阿澈。',
      intro: '产品设计师、业余开发者，也是一名持续学习如何写清楚问题的人。',
      facts: [['身份', '产品设计师'], ['坐标', '上海'], ['记录', '设计 / 代码 / 游戏']],
      storyLabel: 'AUTHOR LOG',
      storyTitle: '一间持续整理想法的小工作室。',
      story: [
        'Pixel Notes 用来记录界面、代码、旧游戏和独立创作。我希望把尚未成形的观察写成可以反复查阅、真正派得上用场的笔记。',
        '网站使用 Pixelium 与 Fusion Pixel 构建，文章则保存在可迁移的 Markdown 文件中，让内容不被某一个发布平台锁住。',
      ],
      topicsLabel: '持续关注',
      topicsAria: '持续关注的主题',
      topics: ['界面设计', '前端开发', '像素设计', '个人网站'],
      connectLabel: 'SIGNAL PORTS',
      connectTitle: '联系与订阅',
      connectCopy: '选择适合你的频道。想稳定收到新文章，RSS 是最直接的方式。',
      links: [
        { code: '01', label: '电子邮件', value: 'hello@example.com', href: 'mailto:hello@example.com' },
        { code: '02', label: 'RSS 订阅', value: '关注最新文章', href: '/rss.xml' },
        { code: '03', label: 'GitHub', value: '代码与项目', href: 'https://github.com/' },
      ],
    }
</script>

<template>
  <main id="main" class="about-shell container">
    <header class="about-header">
      <Tag theme="success">{{ content.label }}</Tag>
      <h1>{{ content.title }}</h1>
      <p>{{ content.intro }}</p>
      <dl class="about-facts">
        <div v-for="fact in content.facts" :key="fact[0]"><dt>{{ fact[0] }}</dt><dd>{{ fact[1] }}</dd></div>
      </dl>
    </header>

    <div class="about-layout">
      <section class="about-story" aria-labelledby="about-story-title">
        <div class="about-identity">
          <div class="about-avatar"><Avatar shape="square" :size="96" bordered background-color="#ffd166">澈</Avatar><span aria-hidden="true">ONLINE</span></div>
          <div><div class="pixel-label">{{ content.storyLabel }}</div><h2 id="about-story-title">{{ content.storyTitle }}</h2></div>
        </div>
        <div class="about-copy"><p v-for="paragraph in content.story" :key="paragraph">{{ paragraph }}</p></div>
        <div class="about-topics" :aria-label="content.topicsAria">
          <span class="pixel-label">{{ content.topicsLabel }}</span>
          <ul><li v-for="topic in content.topics" :key="topic">{{ topic }}</li></ul>
        </div>
      </section>

      <aside class="about-connect" aria-labelledby="about-connect-title">
        <div class="pixel-label">{{ content.connectLabel }}</div>
        <h2 id="about-connect-title">{{ content.connectTitle }}</h2>
        <p>{{ content.connectCopy }}</p>
        <nav class="about-links" :aria-label="content.connectTitle">
          <a v-for="link in content.links" :key="link.href" class="about-link" :href="link.href" :rel="link.href.startsWith('http') ? 'noreferrer' : undefined">
            <small>{{ link.code }}</small><span><strong>{{ link.label }}</strong><em>{{ link.value }}</em></span><i aria-hidden="true">↗</i>
          </a>
        </nav>
      </aside>
    </div>
  </main>
</template>
