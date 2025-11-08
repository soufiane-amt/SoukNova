import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.union([
    z.string().min(6, 'Invalid username'),
    z.string().email('Invalid email'),
  ]),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInInput = z.infer<typeof SignInSchema>;
