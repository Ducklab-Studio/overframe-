import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Portfolio
  await prisma.portfolio.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'portfolio-1',
        title: 'Vanguard Tech',
        category: 'Plataforma Web',
        description: 'Plataforma SaaS de gestão empresarial com dashboard em tempo real.',
        imageUrl: '/portfolio/vanguard.jpg',
        featured: true,
        order: 1,
      },
      {
        id: 'portfolio-2',
        title: 'Nexus Studio',
        category: 'Design System',
        description: 'Design system completo com componentes reutilizáveis e tokens de design.',
        imageUrl: '/portfolio/nexus.jpg',
        featured: true,
        order: 2,
      },
      {
        id: 'portfolio-3',
        title: 'Aura App',
        category: 'Interface Mobile',
        description: 'Aplicativo mobile de bem-estar com experiência premium.',
        imageUrl: '/portfolio/aura.jpg',
        featured: false,
        order: 3,
      },
    ],
  });

  // Testimonials
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'testimonial-1',
        name: 'Carlos Mendes',
        role: 'CEO',
        company: 'Vanguard Tech',
        content: 'A Overframe transformou completamente a nossa presença digital. Resultado acima do esperado.',
        rating: 5,
        featured: true,
      },
      {
        id: 'testimonial-2',
        name: 'Ana Paula',
        role: 'Diretora de Marketing',
        company: 'Nexus Studio',
        content: 'Profissionalismo e criatividade em cada detalhe. Recomendo fortemente.',
        rating: 5,
        featured: true,
      },
      {
        id: 'testimonial-3',
        name: 'Roberto Lima',
        role: 'Fundador',
        company: 'Aura App',
        content: 'Entregaram exatamente o que prometeram, no prazo e com qualidade excepcional.',
        rating: 5,
        featured: false,
      },
    ],
  });

  // Blog Posts
  await prisma.blogPost.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'blog-1',
        title: 'Como um bom design aumenta suas conversões',
        slug: 'design-aumenta-conversoes',
        excerpt: 'Descubra como investir em design estratégico pode dobrar suas taxas de conversão.',
        content: 'Conteúdo completo do post aqui...',
        author: 'Overframe',
        published: true,
        publishedAt: new Date(),
      },
      {
        id: 'blog-2',
        title: 'Tendências de UI/UX para 2025',
        slug: 'tendencias-ui-ux-2025',
        excerpt: 'As principais tendências de design de interface que vão dominar o mercado.',
        content: 'Conteúdo completo do post aqui...',
        author: 'Overframe',
        published: true,
        publishedAt: new Date(),
      },
    ],
  });

  // Pricing
  await prisma.pricingPlan.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'plan-starter',
        name: 'Starter',
        description: 'Ideal para pequenas empresas que querem marcar presença online.',
        price: 1997,
        period: 'projeto',
        features: ['Landing page profissional', 'Design responsivo', 'SEO básico', 'Entrega em 7 dias'],
        highlighted: false,
        order: 1,
      },
      {
        id: 'plan-growth',
        name: 'Growth',
        description: 'Para empresas que querem crescer com estratégia e design de alto nível.',
        price: 3997,
        period: 'projeto',
        features: ['Site completo (até 8 páginas)', 'Design system', 'SEO avançado', 'Integração CRM', 'Entrega em 14 dias'],
        highlighted: true,
        order: 2,
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise',
        description: 'Solução completa para grandes empresas com necessidades avançadas.',
        price: 7997,
        period: 'projeto',
        features: ['Plataforma web completa', 'Design system exclusivo', 'Desenvolvimento full-stack', 'Suporte dedicado', 'Entrega personalizada'],
        highlighted: false,
        order: 3,
      },
    ],
  });

  console.log('Seed concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
