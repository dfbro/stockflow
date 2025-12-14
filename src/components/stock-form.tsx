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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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
      marketLocation: '',
      marketStatus: true,
      closureReason: '',
    },
  });

  const marketStatus = form.watch("marketStatus");

  useEffect(() => {
    if (editingStock) {
      form.reset(editingStock);
    } else {
      form.reset({
        name: '',
        amount: 0,
        description: '',
        imageUrl: '',
        marketLocation: '',
        marketStatus: true,
        closureReason: '',
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

            <Separator />
            
            <FormField
              control={form.control}
              name="marketLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market's Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="marketStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Market Status</FormLabel>
                    <FormDescription>
                      Is the market currently open or closed?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!marketStatus && (
              <FormField
                control={form.control}
                name="closureReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Closure</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Holiday, maintenance, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
