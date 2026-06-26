import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function requireAdmin() {
  const token = cookies().get('ov_admin')?.value;
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  return null;
}
