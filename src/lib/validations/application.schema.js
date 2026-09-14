import { z } from 'zod';

const tcIdentityNumber = z
  .string()
  .regex(/^\d{11}$/, 'T.C. kimlik numarası 11 rakam olmalıdır.')
  .refine((value) => value[0] !== '0', 'Geçersiz T.C. kimlik numarası.')
  .refine((value) => {
    const digits = [...value].map(Number);
    const tenth = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 -
      (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
    const eleventh = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
    return tenth === digits[9] && eleventh === digits[10];
  }, 'Geçersiz T.C. kimlik numarası.');

export const applicationSchema = z.object({
  applicationType: z.literal('yardim'),
  fullName: z.string().trim().min(3).max(150),
  tcIdentityNumber,
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{10,20}$/, 'Geçerli bir telefon giriniz.'),
  email: z.string().trim().toLowerCase().email().max(190).nullable().optional(),
  settlementType: z.enum(['eflani_merkez', 'eflani_koyu', 'eflani_mahallesi']),
  settlementName: z.string().trim().min(2).max(150),
  universityName: z.string().trim().min(2).max(200).nullable().optional(),
  departmentName: z.string().trim().min(2).max(200).nullable().optional(),
  requestDetail: z.string().trim().min(10).max(5000),
  kvkkApproved: z.literal(true, { error: 'KVKK aydınlatma metnini onaylamalısınız.' }),
});
