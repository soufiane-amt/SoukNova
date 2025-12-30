import { z } from 'zod';

export const MessageSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/, 'Invalid characters in first name'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]+$/, 'Invalid characters in last name'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
});

export type MessageForm = z.infer<typeof MessageSchema>;
