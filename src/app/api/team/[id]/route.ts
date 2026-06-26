import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  order: z.number().int().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const err = await requireAdmin();
  if (err) return err;
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  const member = await prisma.teamMember.update({ where: { id: params.id }, data: body.data });
  return NextResponse.json(member);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const err = await requireAdmin();
  if (err) return err;
  await prisma.teamMember.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
