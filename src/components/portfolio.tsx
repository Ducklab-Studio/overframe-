import { prisma } from '@/lib/prisma';
import { RevealText } from '@/components/reveal-text';
import { PortfolioGrid } from '@/components/portfolio-grid';

export async function Portfolio() {
  const items = await prisma.portfolio.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      imageUrl: true,
      videoUrl: true,
      projectUrl: true,
      featured: true,
      technologies: true,
      createdAt: true,
    },
  });

  if (items.length === 0) return null;

  // Serialise dates and Json field for client component
  const serialised = items.map(item => ({
    ...item,
    technologies: (item.technologies as string[]) ?? [],
    createdAt: item.createdAt.toISOString(),
  }));

  return (
    <section id="portfolio" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 md:mb-14">
          <RevealText as="h2" className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-2">
            Nosso trabalho
          </RevealText>
          <p className="text-white/30 text-sm">{items.length} projeto{items.length !== 1 ? 's' : ''} no portfólio</p>
        </div>
        <PortfolioGrid items={serialised} />
      </div>
    </section>
  );
}
