import { prisma } from '@/lib/prisma';
import { RevealText } from '@/components/reveal-text';
import { BlogGrid } from '@/components/blog-grid';

export async function Blog() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 6,
    select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, author: true, publishedAt: true },
  });

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-16 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <RevealText as="h2" className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-2">
            Blog
          </RevealText>
          <p className="text-white/30 text-sm">Conteúdo sobre design, tecnologia e negócios.</p>
        </div>
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
