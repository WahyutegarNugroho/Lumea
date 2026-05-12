import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    toolId: z.string(),
    publishDate: z.date().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  'guides': guides,
};
