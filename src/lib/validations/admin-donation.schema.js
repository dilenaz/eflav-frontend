import { z } from 'zod';

const optionalText = (max) => z.string().trim().max(max).optional().default('');

export const adminDonationSchema = z.object({
  campaignId: z.union([z.number().int().positive(), z.null()]).optional().default(null),
  donationType: z.string().trim().min(3, 'Bağış türünü yazın.').max(150),
  paymentPeriod: z.enum(['tek_seferlik', 'aylik_duzenli']),
  amount: z.coerce.number().positive('Tutar sıfırdan büyük olmalı.').max(100000000),
  senderName: optionalText(150),
  transferDate: z.union([z.string().date(), z.literal('')]).optional().default(''),
  dedicationName: optionalText(150),
  isAnonymous: z.boolean().optional().default(false),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'cancelled']),
  paymentReference: optionalText(255),
});
