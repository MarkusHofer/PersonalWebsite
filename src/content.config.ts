import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
})

const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.enum(['article', 'video']),
      source: z.string().optional(),
      date: z.coerce.date(),
      link: z.string().url(),
      description: z.string().optional(),
      image: image().optional(),
      youtubeId: z.string().optional(),
      language: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
})

const updatesUpcoming = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/updates/upcoming' }),
  schema: z.object({
    text: z.string(),
    date: z.coerce.date(),
    links: z
      .array(
        z.object({
          text: z.string(),
          href: z.string().url(),
        }),
      )
      .optional(),
  }),
})

const updatesPast = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/updates/past' }),
  schema: z.object({
    text: z.string(),
    date: z.coerce.date(),
    links: z
      .array(
        z.object({
          text: z.string(),
          href: z.string().url(),
        }),
      )
      .optional(),
  }),
})

export const collections = { blog, media, updatesUpcoming, updatesPast }
