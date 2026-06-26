import { prisma } from '@/lib/prisma';
import { RevealText } from '@/components/reveal-text';
import { DepoimentosGrid } from '@/components/depoimentos-grid';

export async function Depoimentos() {
  const items = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, role: true, company: true, content: true, rating: true },
  });

  return (
    <section id="depoimentos" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <RevealText as="h2" className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-4">
            O que dizem <span className="text-white/40">sobre nós</span>
          </RevealText>
          <p className="text-white/30 text-lg max-w-xl mx-auto">Clientes que confiaram e viram resultados reais.</p>
        </div>
        <DepoimentosGrid items={items} />
      </div>
    </section>
  );
}
