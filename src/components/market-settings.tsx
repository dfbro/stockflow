'use client';

import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { marketSettingsSchema } from '@/lib/schema';
import type { MarketSettings } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface MarketSettingsProps {
  settings: MarketSettings;
  onSave: (data: MarketSettings) => void;
}

export const MarketSettings: FC<MarketSettingsProps> = ({ settings, onSave }) => {
  const form = useForm<MarketSettings>({
    resolver: zodResolver(marketSettingsSchema),
    defaultValues: settings,
  });

  const marketStatus = form.watch("marketStatus");

  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);
  
  // Automatically submit the form on any change
  useEffect(() => {
    const subscription = form.watch((value) => {
      onSave(value as MarketSettings);
    });
    return () => subscription.unsubscribe();
  }, [form, onSave]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Pasar</CardTitle>
        <CardDescription>
          Kelola lokasi dan status pasar secara keseluruhan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="marketLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Pasar</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., Pasar Induk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />

            <FormField
              control={form.control}
              name="marketStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Pasar</FormLabel>
                    <FormDescription>
                      Apakah pasar saat ini buka atau tutup?
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
                    <FormLabel>Alasan Penutupan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="cth., Hari libur, pemeliharaan, dll."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
