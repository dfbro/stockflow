'use client';

import { AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import type { StockItem } from '@/lib/types';
import { StockItemCard } from './stock-item-card';

interface StockListProps {
  stocks: StockItem[];
  onRemoveStock: (id: string) => void;
  onEditStock: (stock: StockItem) => void;
}

export function StockList({ stocks, onRemoveStock, onEditStock }: StockListProps) {
  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/50 h-96">
        <Inbox className="h-16 w-16 text-muted-foreground/80" />
        <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
          Inventory is Empty
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add new stock items using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <h2 className="text-2xl font-semibold tracking-tight">Current Inventory</h2>
       <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {stocks.map((stock) => (
            <StockItemCard
              key={stock.id}
              stock={stock}
              onRemove={onRemoveStock}
              onEdit={onEditStock}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
