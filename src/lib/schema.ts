import { z } from 'zod';

export const stockItemSchema = z.object({
  name: z.string().min(2, { message: 'Nama harus minimal 2 karakter.' }),
  price: z.coerce
    .number({ invalid_type_error: 'Harga harus berupa angka.'})
    .positive({ message: 'Harga harus berupa angka positif.' }),
  amount: z.coerce
    .number({ invalid_type_error: 'Jumlah harus berupa angka.' })
    .int()
    .positive({ message: 'Jumlah harus berupa angka positif.' }),
  description: z
    .string()
    .min(10, { message: 'Deskripsi harus minimal 10 karakter.' })
    .max(200, { message: 'Deskripsi tidak boleh melebihi 200 karakter.' }),
  imageUrl: z.string().url({ message: 'Silakan masukkan URL gambar yang valid.' }),
});

export const marketSettingsSchema = z.object({
  marketLocation: z.string().min(3, { message: 'Lokasi pasar wajib diisi.'}),
  marketStatus: z.boolean().default(true),
  closureReason: z.string().optional(),
}).refine(data => {
  if (!data.marketStatus && (!data.closureReason || data.closureReason.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "Alasan minimal 10 karakter diperlukan saat pasar ditutup.",
  path: ["closureReason"],
});
