import { z } from 'zod';

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('Password is required'),
    newPassword: z.string().nonempty('New password is required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Passwords must not be the same',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm Password must match new password',
    path: ['confirmPassword'],
  });
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
