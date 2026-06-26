import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { blogPostSchema } from '@/lib/validators';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    });
    if (!post) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const body = await req.json();
    const data = blogPostSchema.partial().parse(body);
    if (data.published && !data.publishedAt) {
      (data as any).publishedAt = new Date().toISOString();
    }
    const post = await prisma.blogPost.update({ where: { slug: params.slug }, data: data as any });
    return NextResponse.json(post);
  } catch (e: any) {
    if (e?.name === 'ZodError') return NextResponse.json({ error: e.errors }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    await prisma.blogPost.delete({ where: { slug: params.slug } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
