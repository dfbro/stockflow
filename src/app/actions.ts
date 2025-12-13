'use server';

import type { StockItem } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Simulate an API call
async function apiCall(data: StockItem[]): Promise<{ success: boolean; message: string }> {
  console.log('Submitting to API:', data);
  // This is a simulation. In a real app, you would use fetch() to send data to your API endpoint.
  // The 'queuing' feature mentioned in the proposal would typically be handled by a service worker
  // or a more complex backend system, which is beyond the scope of this simulation.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a random success/failure
      if (Math.random() > 0.2) {
        resolve({ success: true, message: 'Stock data submitted successfully!' });
      } else {
        resolve({ success: false, message: 'API submission failed. Please try again.' });
      }
    }, 1500);
  });
}

export async function submitStockData(stocks: StockItem[]) {
  if (stocks.length === 0) {
    return { success: false, message: 'Cannot submit an empty stock list.' };
  }

  try {
    const result = await apiCall(stocks);
    if (result.success) {
      // In a real app, you might clear the local state after a successful submission.
      // For this demo, we'll keep the data.
      revalidatePath('/');
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('API submission error:', error);
    return { success: false, message: 'An unexpected error occurred during submission.' };
  }
}
