import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const guides = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
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
