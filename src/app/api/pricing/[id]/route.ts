import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { pricingSchema } from '@/lib/validators';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const body = await req.json();
    const data = pricingSchema.partial().parse(body);
    const plan = await prisma.pricingPlan.update({ where: { id: params.id }, data });
    return NextResponse.json(plan);
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    await prisma.pricingPlan.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
