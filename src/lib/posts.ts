import type { CollectionEntry } from 'astro:content'

export type PostEntry = CollectionEntry<'posts'>
export type EnglishPostEntry = CollectionEntry<'postsEn'>

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
}

export function sortEnglishPosts(posts: EnglishPostEntry[]) {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
}

export function serializeEnglishPost(post: EnglishPostEntry) {
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

export function orderedCounts(values: string[], order: readonly string[]) {
  const totals = new Map<string, number>()
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1))
  const orderedLabels = [...order.filter((label) => totals.has(label)), ...[...totals.keys()].filter((label) => !order.includes(label)).sort((a, b) => a.localeCompare(b))]
  return orderedLabels.flatMap((label) => {
    const count = totals.get(label)
    return count ? [{ label, count }] : []
  })
}
