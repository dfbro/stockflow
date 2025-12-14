'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { StockItem } from '@/lib/types';
import { Badge } from './ui/badge';

interface StockItemCardProps {
  stock: StockItem;
  onRemove: (id: string) => void;
  onEdit: (stock: StockItem) => void;
}

export function StockItemCard({ stock, onRemove, onEdit }: StockItemCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="list-none"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={stock.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'}
            alt={stock.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint="product item"
          />
        </div>
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            {stock.name}
            <Badge variant="secondary" className="whitespace-nowrap">
              Jml: {stock.amount}
            </Badge>
          </CardTitle>
          <CardDescription className="pt-2">{stock.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onEdit(stock)}
            aria-label={`Ubah ${stock.name}`}
          >
            <Edit />
            Ubah
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onRemove(stock.id)}
            aria-label={`Hapus ${stock.name}`}
          >
            <Trash2 />
            Hapus
          </Button>
        </CardFooter>
      </Card>
    </motion.li>
  );
}
