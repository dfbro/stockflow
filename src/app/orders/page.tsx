
import Link from 'next/link';
import { Home, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Segera Hadir</CardTitle>
          <CardDescription className="text-muted-foreground">
            Halaman daftar pesanan sedang dalam pengembangan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Kami sedang bekerja keras untuk memberikan fitur ini kepada Anda. Silakan periksa kembali nanti!
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
