import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { StockDataPayload } from '@/lib/types';

// The path to the data.json file
const dataFilePath = path.join(process.cwd(), 'data.json');

// Helper function to read data from the JSON file
async function readData(): Promise<StockDataPayload> {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    // If the file is empty or just whitespace, return default structure
    if (!fileData.trim()) {
      return { stocks: [], marketSettings: { marketLocation: '', marketStatus: true, closureReason: '' } };
    }
    return JSON.parse(fileData);
  } catch (error) {
    // If the file does not exist, return an empty array and create the file
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      const defaultData = { stocks: [], marketSettings: { marketLocation: 'Downtown Store', marketStatus: true, closureReason: '' } };
      await writeData(defaultData);
      return defaultData;
    }
    // For other errors, re-throw
    throw error;
  }
}

// Helper function to write data to the JSON file
async function writeData(data: StockDataPayload): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * GET /api/stocks
 * Returns the current list of stocks and market settings.
 */
export async function GET() {
  try {
    const data = await readData();
    // Manually stringify with indentation for pretty printing
    const prettyJson = JSON.stringify(data, null, 2);
    return new NextResponse(prettyJson, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to read data:', error);
    return NextResponse.json(
      { message: 'Failed to read data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stocks
 * Saves the provided list of stocks and market settings.
 */
export async function POST(request: Request) {
  try {
    const data: StockDataPayload = await request.json();
    await writeData(data);
    return NextResponse.json(
      { message: 'Market data saved successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json(
      { message: 'Failed to save data' },
      { status: 500 }
    );
  }
}
