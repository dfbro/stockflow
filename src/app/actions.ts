'use server';

import type { StockItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';

async function apiCall(data: StockItem[]): Promise<{ success: boolean; message: string }> {
  try {
    // In a real app, you would get this URL from an environment variable
    const apiUrl = process.env.NODE_ENV === 'production'
      ? 'https://<your-production-url>/api/stocks' 
      : 'http://localhost:9002/api/stocks';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, message: result.message || 'Stock data submitted successfully!' };
    } else {
      const errorResult = await response.json();
      return { success: false, message: errorResult.message || 'API submission failed. Please try again.' };
    }
  } catch (error) {
    console.error('API submission error:', error);
    if (error instanceof Error) {
      return { success: false, message: `An unexpected error occurred: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred during submission.' };
  }
}

export async function submitStockData(stocks: StockItem[]) {
  try {
    const result = await apiCall(stocks);
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/api/stocks');
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('API submission error:', error);
    return { success: false, message: 'An unexpected error occurred during submission.' };
  }
}
