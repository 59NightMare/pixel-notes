import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { sortPosts } from '../lib/posts'

export async function GET(context: APIContext) {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft))
  return rss({
    title: 'Pixel Notes',
    description: '记录设计、代码、旧游戏与独立创作的像素风博客。',
    site: context.site!,
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.publishedAt,
      link: `/posts/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
  })
}
