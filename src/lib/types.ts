import type { z } from 'zod';
import type { stockItemSchema, marketSettingsSchema } from '@/lib/schema';

// Types for individual stock items
export type StockItemData = z.infer<typeof stockItemSchema>;
export type StockItem = StockItemData & { id: string };

// Type for market settings
export type MarketSettings = z.infer<typeof marketSettingsSchema>;

// Type for the combined data payload for the API
export type StockDataPayload = {
  stocks: StockItem[];
  marketSettings: MarketSettings;
};
