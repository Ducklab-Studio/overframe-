import { z } from 'zod';

export const portfolioSchema = z.object({
  title:        z.string().min(1).max(120),
  category:     z.string().min(1).max(80),
  description:  z.string().max(1000).optional(),
  imageUrl:     z.string().max(300).optional(),
  videoUrl:     z.string().max(500).optional(),
  projectUrl:   z.string().max(300).optional(),
  featured:     z.boolean().optional(),
  order:        z.number().int().min(0).optional(),
  technologies: z.array(z.string().max(60)).max(20).optional(),
});

export const testimonialSchema = z.object({
  name:      z.string().min(1).max(100),
  role:      z.string().max(80).optional(),
  company:   z.string().max(100).optional(),
  avatarUrl: z.string().max(300).optional(),
  content:   z.string().min(1).max(1000),
  rating:    z.number().int().min(1).max(5).optional(),
  featured:  z.boolean().optional(),
});

export const blogPostSchema = z.object({
  title:       z.string().min(1).max(200),
  slug:        z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(200),
  excerpt:     z.string().max(500).optional(),
  content:     z.string().min(1).max(50000),
  coverImage:  z.string().max(300).optional(),
  author:      z.string().max(100).optional(),
  published:   z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const pricingSchema = z.object({
  name:        z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price:       z.number().positive().max(999999),
  period:      z.string().max(30).optional(),
  features:    z.array(z.string().max(200)).max(20),
  highlighted: z.boolean().optional(),
  order:       z.number().int().min(0).optional(),
});
