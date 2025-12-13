import { z } from 'zod';

export const stockSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number.' })
    .int()
    .positive({ message: 'Amount must be a positive number.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(200, { message: 'Description cannot exceed 200 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }),
});
