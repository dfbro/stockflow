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
import { stockSchema } from '@/lib/schema';
import type { StockItem, StockItemData } from '@/lib/types';

interface StockFormProps {
  onSave: (data: StockItem) => void;
  editingStock: StockItem | null;
  onClearEditing: () => void;
}

export const StockForm: FC<StockFormProps> = ({ onSave, editingStock, onClearEditing }) => {
  const form = useForm<StockItemData>({
    resolver: zodResolver(stockSchema),
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
        <CardTitle>{editingStock ? 'Edit Stock' : 'Add New Stock'}</CardTitle>
        <CardDescription>
          {editingStock ? 'Update the details of the stock item.' : 'Fill in the form to add a new item to your inventory.'}
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
                  <FormLabel>Stock Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Widgets" {...field} />
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the stock item."
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://picsum.photos/seed/1/600/400" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a link to an image of the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {editingStock ? <Save /> : <PlusCircle />}
                {editingStock ? 'Save Changes' : 'Add to Inventory'}
              </Button>
              {editingStock && (
                <Button variant="outline" className="w-full" onClick={onClearEditing}>
                  <XCircle />
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
