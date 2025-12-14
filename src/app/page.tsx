'use client';

import { useState, useTransition, useEffect, type FC } from 'react';
import { Package, Send, LoaderCircle } from 'lucide-react';
import { StockForm } from '@/components/stock-form';
import { StockList } from '@/components/stock-list';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { StockItem as StockItemType, StockItemData, MarketSettings as MarketSettingsType } from '@/lib/types';
import { submitStockData } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketSettings } from '@/components/market-settings';

const Page: FC = () => {
  const [stocks, setStocks] = useState<StockItemType[]>([]);
  const [marketSettings, setMarketSettings] = useState<MarketSettingsType | null>(null);
  const [editingStock, setEditingStock] = useState<StockItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStocks(Array.isArray(data.stocks) ? data.stocks : []);
        setMarketSettings(data.marketSettings || null);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load initial data.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);


  const handleAddStock = (newStockData: StockItemData) => {
    const newStock: StockItemType = {
      id: crypto.randomUUID(),
      ...newStockData,
    };
    const newStocks = [newStock, ...stocks];
    setStocks(newStocks);
    toast({
      title: 'Stock Added',
      description: `${newStock.name} has been added to your inventory.`,
    });
  };

  const handleUpdateStock = (updatedStock: StockItemType) => {
    const newStocks = stocks.map((stock) =>
      stock.id === updatedStock.id ? updatedStock : stock
    );
    setStocks(newStocks);
    setEditingStock(null);
    toast({
      title: 'Stock Updated',
      description: `${updatedStock.name} has been updated.`,
    });
  };

  const handleRemoveStock = (id: string) => {
    setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
  };
  
  const handleUpdateMarketSettings = (settings: MarketSettingsType) => {
    setMarketSettings(settings);
    toast({
        title: 'Settings Updated',
        description: 'Market settings have been updated locally.',
    });
  }

  const handleApiSubmit = () => {
    if (!marketSettings) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Market settings are not available.',
      });
      return;
    }
    startTransition(async () => {
      const result = await submitStockData({stocks, marketSettings});
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

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">StockFlow</h1>
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
             <Skeleton className="h-[400px] rounded-lg" />
             <Skeleton className="h-[300px] rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-96 rounded-lg" />
                <Skeleton className="h-96 rounded-lg" />
              </div>
            </div>
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
  }

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
              disabled={isPending || editingStock !== null || !marketSettings}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Send />
              )}
              <span>
                {isPending ? 'Saving...' : 'Update Market'}
              </span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
             <StockForm 
                onSave={editingStock ? handleUpdateStock : handleAddStock} 
                editingStock={editingStock}
                onClearEditing={() => setEditingStock(null)}
              />
            {isLoading || !marketSettings ? (
                <Skeleton className="h-[300px] rounded-lg" />
            ) : (
                <MarketSettings
                    settings={marketSettings}
                    onSave={handleUpdateMarketSettings}
                />
            )}
          </div>
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-96 rounded-lg" />
                  <Skeleton className="h-96 rounded-lg" />
                </div>
              </div>
            ) : (
              <StockList
                stocks={stocks}
                onRemoveStock={handleRemoveStock}
                onEditStock={(stock) => setEditingStock(stock)}
              />
            )}
          </div>
        </div>
      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          {isClient && <span suppressHydrationWarning>&copy; {new Date().getFullYear()} StockFlow. All rights reserved.</span>}
        </div>
      </footer>
    </div>
  );
};

export default Page;
