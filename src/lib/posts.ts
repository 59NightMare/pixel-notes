import type { CollectionEntry } from 'astro:content'

export type PostEntry = CollectionEntry<'posts'>

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
}

export function serializePost(post: PostEntry) {
  return {
    id: post.id,
    title: post.data.title,
    summary: post.data.summary,
    category: post.data.category,
    publishedAt: post.data.publishedAt.toISOString().slice(0, 10).replaceAll('-', '.'),
    updatedAt: post.data.updatedAt?.toISOString().slice(0, 10).replaceAll('-', '.'),
    readingTime: post.data.readingTime,
    tags: post.data.tags,
    cover: post.data.cover,
    ogImage: post.data.ogImage,
    coverAlt: post.data.coverAlt,
  }
}

export function counts(values: string[]) {
  return [...new Set(values)].map((label) => ({ label, count: values.filter((value) => value === label).length }))
}
