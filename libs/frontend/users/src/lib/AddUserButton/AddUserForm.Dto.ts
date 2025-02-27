import { z } from 'zod';

export const AddUserSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().nonempty('Email is required').email('Field must be an email'),
  password: z.string().nonempty('Password is required'),
});

export type AddUserDto = z.infer<typeof AddUserSchema>;
