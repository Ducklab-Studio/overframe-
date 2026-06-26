import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { testimonialSchema } from '@/lib/validators';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const { id } = await params;
    const body = await req.json();
    const data = testimonialSchema.partial().parse(body);
    const item = await prisma.testimonial.update({ where: { id }, data });
    revalidatePath('/');
    return NextResponse.json(item);
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
