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
  marketLocation: z.string().min(3, { message: 'Market location is required.'}),
  marketStatus: z.boolean().default(true),
  closureReason: z.string().optional(),
}).refine(data => {
  if (!data.marketStatus && (!data.closureReason || data.closureReason.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "A reason of at least 10 characters is required when the market is closed.",
  path: ["closureReason"],
});
