import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { testimonialSchema } from '@/lib/validators';

export async function GET() {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const body = await req.json();
    const data = testimonialSchema.parse(body);
    const item = await prisma.testimonial.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
