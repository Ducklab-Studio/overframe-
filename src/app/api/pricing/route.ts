import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { pricingSchema } from '@/lib/validators';

export async function GET() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const body = await req.json();
    const data = pricingSchema.parse(body);
    const plan = await prisma.pricingPlan.create({ data });
    revalidatePath('/');
    return NextResponse.json(plan, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
