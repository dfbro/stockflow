import type { z } from 'zod';
import type { stockSchema } from '@/lib/schema';

export type StockItemData = z.infer<typeof stockSchema>;
export type StockItem = StockItemData & { id: string };
