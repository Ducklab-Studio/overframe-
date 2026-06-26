'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { RevealText } from '@/components/reveal-text';

// ── Variants ──────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

// ── TiltCard ──────────────────────────────────────────────
interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = '' }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [-50, 50], [8, -8]);
  const rotateY = useTransform(springX, [-50, 50], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(e.clientX - cx);
    rawY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ── Data ──────────────────────────────────────────────────
const SERVICES = [
  {
    id: '01',
    title: 'Desenvolvimento Web',
    description:
      'Sistemas limpos, escaláveis e rápidos, focados na melhor experiência do usuário.',
  },
  {
    id: '02',
    title: 'Identidade Visual',
    description:
      'Design elegante e minimalista que transmite profissionalismo e confiança.',
  },
  {
    id: '03',
    title: 'Copywriting',
    description:
      'Comunicação sutil e persuasiva que conecta e converte sem fricção.',
  },
  {
    id: '04',
    title: 'Edição de Vídeo',
    description:
      'Produções audiovisuais modernas com estética refinada e cinematográfica.',
  },
];

// ── Component ─────────────────────────────────────────────
export const Servicos = () => {
  return (
    <section id="servicos" className="py-32 relative z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-24">
          <RevealText
            as="h2"
            className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight"
          >
            Soluções essenciais{' '}
            <span className="text-white/40">para o seu negócio.</span>
          </RevealText>
        </div>

        {/* perspective wrapper */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          style={{ perspective: '800px' }}
        >
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index * 0.1}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="group h-full rounded-2xl md:rounded-3xl bg-[#111111] border border-white/5 p-4 md:p-8 hover:border-[#E10600]/30 hover:shadow-[0_10px_40px_rgba(225,6,0,0.07)] transition-colors duration-500 flex flex-col cursor-default">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-white/50 mb-4 md:mb-8 group-hover:bg-[#E10600] group-hover:text-white transition-colors duration-500">
                  <span className="text-xs md:text-sm font-bold">{service.id}</span>
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-[#F2F2F2] mb-2 md:mb-3 group-hover:text-[#E10600] transition-colors duration-500 leading-snug">
                  {service.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-xs md:text-sm font-light">
                  {service.description}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
