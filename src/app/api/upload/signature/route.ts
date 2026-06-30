import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  // O Cloudinary Upload Widget envia os parâmetros que precisam ser assinados
  const body = await req.json().catch(() => null);
  const paramsToSign: Record<string, string | number> =
    body && typeof body === 'object' ? body : {};

  // Garante timestamp caso o widget não envie
  if (!paramsToSign.timestamp) {
    paramsToSign.timestamp = Math.round(Date.now() / 1000);
  }
  if (!paramsToSign.folder) {
    paramsToSign.folder = 'overframe';
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp: paramsToSign.timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
  });
}
