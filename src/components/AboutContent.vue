<script setup lang="ts">
import { Avatar, Card, Tag } from '@pixelium/web-vue'
</script>
<template><main id="main" class="about-shell container"><header><Tag theme="success">ABOUT</Tag><h1>你好，我是阿澈。</h1><p>产品设计师、业余开发者，也是一名持续学习如何写清楚问题的人。</p></header><div class="about-grid"><Card bordered><div class="about-profile"><Avatar shape="square" :size="88" bordered background-color="#ffd166">澈</Avatar><div><h2>关于这个博客</h2><p>Pixel Notes 用来记录界面、代码、旧游戏和独立创作。所有页面使用 Pixelium 与 Fusion Pixel，内容则保存在可迁移的 Markdown 文件中。</p></div></div></Card><Card title="联系与订阅" bordered><ul><li><a href="mailto:hello@example.com">hello@example.com</a></li><li><a href="/rss.xml">RSS 订阅</a></li><li><a href="https://github.com/" rel="noreferrer">GitHub</a></li></ul></Card></div></main></template>
