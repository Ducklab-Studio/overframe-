import { prisma } from '@/lib/prisma';
import { RevealText } from '@/components/reveal-text';
import { TimeGrid } from '@/components/time-grid';

export async function Time() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  if (members.length === 0) return null;

  return (
    <section id="time" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <RevealText as="h2" className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-4">
            Nosso time
          </RevealText>
          <p className="text-white/30 text-lg max-w-xl mx-auto">
            Pessoas que transformam ideias em resultados extraordinários.
          </p>
        </div>
        <TimeGrid members={members} />
      </div>
    </section>
  );
}
