import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const isVideo = file.type.startsWith('video/');

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: isVideo ? 'video' : 'image', folder: 'overframe' },
        (error, res) => {
          if (error || !res) reject(error ?? new Error('Upload falhou'));
          else resolve(res);
        },
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}
