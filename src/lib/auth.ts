import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_JWT_SECRET ausente ou fraco (mín. 32 chars)');
  return new TextEncoder().encode(s);
}

export async function signToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
