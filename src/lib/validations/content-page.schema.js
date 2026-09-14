import { z } from 'zod';
import { IMAGE_URL_MESSAGE, isAllowedImageUrl } from '@/lib/image-url';

const optionalImage = z.string().trim().max(500).refine(isAllowedImageUrl, IMAGE_URL_MESSAGE).nullable().optional();
const memberSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  roleTitle: z.string().trim().min(2).max(150),
  imageUrl: z.string().trim().min(1, 'Her yönetim kurulu üyesi için fotoğraf yükleyin.').max(500).refine(isAllowedImageUrl, IMAGE_URL_MESSAGE),
  imageAlt: z.string().trim().max(255).nullable().optional(),
});

export const contentPageSchema = z.object({
  title: z.string().trim().min(3).max(255),
  eyebrow: z.string().trim().max(100).nullable().optional(),
  summary: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20).max(100000),
  imageUrl: optionalImage,
  imageAlt: z.string().trim().max(255).nullable().optional(),
  members: z.array(memberSchema).max(30).optional(),
});
