import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				course: z.string().optional(),
				track: z.string().optional(),
				moduleNumber: z.number().optional(),
				lessonType: z.enum(['Tutorial', 'Hands-on', 'Reference']).optional(),
				recovery: z.enum(['recovered-original', 'reconstructed', 'authored']).optional(),
			}),
		}),
	}),
};
