import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { cloudinary } from '@/lib/cloudinary';

export async function POST() {
  const deny = await requireAdmin();
  if (deny) return deny;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'overframe';

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  });
}
