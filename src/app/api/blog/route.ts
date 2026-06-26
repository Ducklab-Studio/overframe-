import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';
import { blogPostSchema } from '@/lib/validators';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function isAdmin() {
  const token = (await cookies()).get('ov_admin')?.value;
  if (!token) return false;
  return !!(await verifyToken(token));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wantsUnpublished = searchParams.get('published') === 'false';

    const admin = wantsUnpublished ? await isAdmin() : false;
    const where = admin ? {} : { published: true };

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverImage: true, author: true, published: true,
        publishedAt: true, createdAt: true,
      },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const body = await req.json();
    const parsed = blogPostSchema.parse(body);
    const post = await prisma.blogPost.create({
      data: {
        ...parsed,
        publishedAt: parsed.published && !parsed.publishedAt
          ? new Date().toISOString()
          : (parsed.publishedAt ?? null),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) return NextResponse.json({ error: e.errors }, { status: 422 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
