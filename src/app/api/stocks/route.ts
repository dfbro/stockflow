import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { StockItem } from '@/lib/types';

// The path to the stocks.json file
const dataFilePath = path.join(process.cwd(), 'stocks.json');

// Helper function to read data from the JSON file
async function readData(): Promise<StockItem[]> {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    // If the file is empty or just whitespace, return an empty array
    if (!fileData.trim()) {
      return [];
    }
    return JSON.parse(fileData);
  } catch (error) {
    // If the file does not exist, return an empty array
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Optional: create the file if it doesn't exist
      await writeData([]);
      return [];
    }
    // For other errors, re-throw
    throw error;
  }
}

// Helper function to write data to the JSON file
async function writeData(data: StockItem[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * GET /api/stocks
 * Returns the current list of stocks.
 */
export async function GET() {
  try {
    const stocks = await readData();
    // Manually stringify with indentation for pretty printing
    const prettyJson = JSON.stringify(stocks, null, 2);
    return new NextResponse(prettyJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to read stock data:', error);
    return NextResponse.json(
      { message: 'Failed to read stock data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stocks
 * Saves the provided list of stocks.
 */
export async function POST(request: Request) {
  try {
    const stocks: StockItem[] = await request.json();
    await writeData(stocks);
    return NextResponse.json(
      { message: 'Stock data saved successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to save stock data:', error);
    return NextResponse.json(
      { message: 'Failed to save stock data' },
      { status: 500 }
    );
  }
}
