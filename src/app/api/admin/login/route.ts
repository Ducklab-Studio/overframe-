import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  // 5 tentativas por IP a cada 15 minutos
  if (!rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde 15 minutos.' },
      { status: 429 }
    );
  }

  let serial: string;
  try {
    const body = await req.json();
    serial = body?.serial ?? '';
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
  }

  const expected = process.env.ADMIN_SERIAL ?? '';
  if (!expected) {
    return NextResponse.json({ error: 'Servidor mal configurado' }, { status: 500 });
  }

  if (!serial || serial.trim().toUpperCase() !== expected.toUpperCase()) {
    // Delay para dificultar timing attacks
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ error: 'Serial inválido' }, { status: 401 });
  }

  const token = await signToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ov_admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
