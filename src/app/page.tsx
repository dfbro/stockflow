'use client';

import { useState, useTransition, type FC } from 'react';
import { Package, Send, LoaderCircle } from 'lucide-react';
import { StockForm } from '@/components/stock-form';
import { StockList } from '@/components/stock-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { StockItem as StockItemType, StockItemData } from '@/lib/types';
import { submitStockData } from './actions';

const initialStocks: StockItemType[] = [
  {
    id: 'd8c7c3c8-1b2c-4f5a-9e2a-7b3f1b3e7b1a',
    name: 'Heavy-Duty Widgets',
    amount: 150,
    description: 'Industrial grade widgets for heavy machinery. Pack of 50.',
    imageUrl: 'https://picsum.photos/seed/widgets/400/300',
  },
  {
    id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    name: 'Precision Gears',
    amount: 320,
    description: 'High-precision gears for electronic devices. Stainless steel.',
    imageUrl: 'https://picsum.photos/seed/gears/400/300',
  },
];

const Page: FC = () => {
  const [stocks, setStocks] = useState<StockItemType[]>(initialStocks);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddStock = (newStockData: StockItemData) => {
    const newStock: StockItemType = {
      id: crypto.randomUUID(),
      ...newStockData,
    };
    setStocks((prevStocks) => [newStock, ...prevStocks]);
    toast({
      title: 'Stock Added',
      description: `${newStock.name} has been added to your inventory.`,
    });
  };

  const handleRemoveStock = (id: string) => {
    setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
  };

  const handleApiSubmit = () => {
    startTransition(async () => {
      const result = await submitStockData(stocks);
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">StockFlow</h1>
            </div>
            <Button
              onClick={handleApiSubmit}
              disabled={stocks.length === 0 || isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Send />
              )}
              <span>
                {isPending ? 'Submitting...' : 'Submit to API'}
              </span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <StockForm onAddStock={handleAddStock} />
          </div>
          <div className="lg:col-span-2">
            <StockList stocks={stocks} onRemoveStock={handleRemoveStock} />
          </div>
        </div>
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Page;
