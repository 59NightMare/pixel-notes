import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { categories, tags } from './config/taxonomy'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().max(70),
    summary: z.string().min(20).max(180),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(categories),
    tags: z.array(z.enum(tags)).max(5).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    readingTime: z.number().int().positive(),
    cover: z.string().startsWith('/images/posts/'),
    ogImage: z.string().startsWith('/images/og/').optional(),
    coverAlt: z.string(),
  }),
})

export const collections = { posts }
