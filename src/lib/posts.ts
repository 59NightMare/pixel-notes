import type { CollectionEntry } from 'astro:content'

export type PostEntry = CollectionEntry<'posts'>
export type EnglishPostEntry = CollectionEntry<'postsEn'>

type PostLike = { data: { publishedAt: Date } }

export function sortPosts<T extends PostLike>(posts: T[]) {
  return [...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
}

export const sortEnglishPosts = sortPosts

function serializePostData<T extends PostEntry | EnglishPostEntry>(post: T) {
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

export const serializeEnglishPost = serializePostData
export const serializePost = serializePostData

export function orderedCounts(values: string[], order: readonly string[]) {
  const totals = new Map<string, number>()
  values.forEach((value) => totals.set(value, (totals.get(value) ?? 0) + 1))
  const orderedLabels = [...order.filter((label) => totals.has(label)), ...[...totals.keys()].filter((label) => !order.includes(label)).sort((a, b) => a.localeCompare(b))]
  return orderedLabels.flatMap((label) => {
    const count = totals.get(label)
    return count ? [{ label, count }] : []
  })
}
