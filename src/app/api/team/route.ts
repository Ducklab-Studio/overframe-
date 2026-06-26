import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  order: z.number().int().default(0),
});

export async function GET() {
  const members = await prisma.teamMember.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  const member = await prisma.teamMember.create({ data: body.data });
  return NextResponse.json(member, { status: 201 });
}
