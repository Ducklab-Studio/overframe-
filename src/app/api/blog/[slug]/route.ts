import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { blogPostSchema } from '@/lib/validators';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });
    if (!post) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const { slug } = await params;
    const body = await req.json();
    const parsed = blogPostSchema.partial().parse(body);
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...parsed,
        publishedAt: parsed.published && !parsed.publishedAt
          ? new Date().toISOString()
          : parsed.publishedAt,
      },
    });
    revalidatePath('/');
    return NextResponse.json(post);
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.issues }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const { slug } = await params;
    await prisma.blogPost.delete({ where: { slug } });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
