import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { portfolioSchema } from '@/lib/validators';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.portfolio.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const { id } = await params;
    const body = await req.json();
    const data = portfolioSchema.partial().parse(body);
    const item = await prisma.portfolio.update({ where: { id }, data });
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
    await prisma.portfolio.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
