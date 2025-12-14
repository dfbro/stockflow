'use client';

import { useState, useTransition, useEffect, type FC } from 'react';
import Link from 'next/link';
import { Package, Send, LoaderCircle, ClipboardList } from 'lucide-react';
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
  
  const [originalStocks, setOriginalStocks] = useState<StockItemType[]>([]);
  const [originalMarketSettings, setOriginalMarketSettings] = useState<MarketSettingsType | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
          throw new Error('Gagal mengambil data');
        }
        const data = await response.json();
        
        const fetchedStocks = Array.isArray(data.stocks) ? data.stocks : [];
        const fetchedSettings = data.marketSettings || null;

        setStocks(fetchedStocks);
        setMarketSettings(fetchedSettings);
        setOriginalStocks(fetchedStocks);
        setOriginalMarketSettings(fetchedSettings);

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Tidak dapat memuat data awal.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    const stocksChanged = JSON.stringify(stocks) !== JSON.stringify(originalStocks);
    const settingsChanged = JSON.stringify(marketSettings) !== JSON.stringify(originalMarketSettings);
    setHasUnsavedChanges(stocksChanged || settingsChanged);
  }, [stocks, marketSettings, originalStocks, originalMarketSettings]);


  const handleAddStock = (newStockData: StockItemData) => {
    const newStock: StockItemType = {
      id: crypto.randomUUID(),
      ...newStockData,
    };
    const newStocks = [newStock, ...stocks];
    setStocks(newStocks);
    toast({
      title: 'Stok Ditambahkan',
      description: `${newStock.name} telah ditambahkan ke inventaris Anda.`,
    });
  };

  const handleUpdateStock = (updatedStock: StockItemType) => {
    const newStocks = stocks.map((stock) =>
      stock.id === updatedStock.id ? updatedStock : stock
    );
    setStocks(newStocks);
    setEditingStock(null);
    toast({
      title: 'Stok Diperbarui',
      description: `${updatedStock.name} telah diperbarui.`,
    });
  };

  const handleRemoveStock = (id: string) => {
    setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
  };
  
  const handleUpdateMarketSettings = (settings: MarketSettingsType) => {
    setMarketSettings(settings);
  }

  const handleApiSubmit = () => {
    if (!marketSettings) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Pengaturan pasar tidak tersedia.',
      });
      return;
    }
    startTransition(async () => {
      const result = await submitStockData({stocks, marketSettings});
      if (result.success) {
        setOriginalStocks(stocks);
        setOriginalMarketSettings(marketSettings);
        toast({
          title: 'Sukses!',
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
          &copy; {new Date().getFullYear()} StockFlow. Semua hak dilindungi.
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
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/orders">
                  <ClipboardList />
                  Daftar Pesanan
                </Link>
              </Button>
              <Button
                onClick={handleApiSubmit}
                disabled={isPending || editingStock !== null || !hasUnsavedChanges}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Send />
                )}
                <span>
                  {isPending ? 'Menyimpan...' : 'Perbarui Pasar'}
                </span>
              </Button>
            </div>
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
          {isClient && <span suppressHydrationWarning>&copy; {new Date().getFullYear()} StockFlow. Semua hak dilindungi.</span>}
        </div>
      </footer>
    </div>
  );
};

export default Page;
