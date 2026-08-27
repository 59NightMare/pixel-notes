import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const optionalDate = z.preprocess((value) => value === '' || value === null ? undefined : value, z.coerce.date().optional())
const optionalOgImage = z.preprocess((value) => value === '' || value === null ? undefined : value, z.string().startsWith('/images/og/').optional())

const postSchema = z.object({
  title: z.string().max(70),
  summary: z.string().min(20).max(180),
  publishedAt: z.coerce.date(),
  updatedAt: optionalDate,
  category: z.string().trim().min(1).max(30),
  tags: z.array(z.string().trim().min(1).max(30)).max(5).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  readingTime: z.number().int().positive(),
  cover: z.string().startsWith('/images/posts/'),
  ogImage: optionalOgImage,
  coverAlt: z.string(),
})

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: postSchema,
})

const postsEn = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts-en' }),
  schema: postSchema,
})

export const collections = { posts, postsEn }
