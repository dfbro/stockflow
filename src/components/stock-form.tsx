'use client';

import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { stockItemSchema } from '@/lib/schema';
import type { StockItem, StockItemData } from '@/lib/types';

interface StockFormProps {
  onSave: (data: StockItem) => void;
  editingStock: StockItem | null;
  onClearEditing: () => void;
}

export const StockForm: FC<StockFormProps> = ({ onSave, editingStock, onClearEditing }) => {
  const form = useForm<StockItemData>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: {
      name: '',
      amount: 0,
      description: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (editingStock) {
      form.reset(editingStock);
    } else {
      form.reset({
        name: '',
        amount: 0,
        description: '',
        imageUrl: '',
      });
    }
  }, [editingStock, form]);

  function onSubmit(data: StockItemData) {
    const stockToSave: StockItem = {
      id: editingStock ? editingStock.id : crypto.randomUUID(),
      ...data,
    };
    onSave(stockToSave);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingStock ? 'Ubah Stok' : 'Tambah Stok Baru'}</CardTitle>
        <CardDescription>
          {editingStock ? 'Perbarui detail item stok.' : 'Isi formulir untuk menambahkan item baru ke inventaris Anda.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Stok</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., Bawang Merah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="cth., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tentang item stok."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar</FormLabel>
                  <FormControl>
                    <Input placeholder="https://picsum.photos/seed/1/600/400" {...field} />
                  </FormControl>
                  <FormDescription>
                    Berikan tautan ke gambar item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {editingStock ? <Save /> : <PlusCircle />}
                {editingStock ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
              </Button>
              {editingStock && (
                <Button variant="outline" className="w-full" onClick={onClearEditing}>
                  <XCircle />
                  Batalkan Pengeditan
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
