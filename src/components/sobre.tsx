'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RevealText } from '@/components/reveal-text';

// ── AnimatedNumber ─────────────────────────────────────────
interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber = ({ value, suffix = '', duration = 1500 }: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const steps = 60;
    const stepValue = value / steps;
    const interval = duration / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      // ease-out: mais rápido no início, desacelera no final
      const progress = count / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * value);
      setDisplay(current);
      if (count >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

// ── Sobre ──────────────────────────────────────────────────
export const Sobre = () => {
  return (
    <section id="sobre" className="py-32 relative" style={{ scrollMarginTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="w-full aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#111111] border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
                alt="Studio Overframer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-700"
              />
            </div>
          </motion.div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <RevealText
              as="h2"
              className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-8"
            >
              A elegância na{' '}
              <span className="text-white/40">simplicidade.</span>
            </RevealText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-white/60 text-lg font-light leading-relaxed mb-12"
            >
              <p>
                A Overframer nasceu da crença de que menos é mais. Nosso
                estúdio desenha e desenvolve produtos digitais que comunicam
                luxo, sofisticação e clareza.
              </p>
              <p>
                Removemos o ruído para que a essência da sua marca possa ser
                ouvida. Criamos experiências imersivas que não apenas
                impressionam, mas constroem conexões verdadeiras.
              </p>
            </motion.div>

            {/* Contadores Animados */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-8"
            >
              <div>
                <h4 className="text-4xl font-semibold text-[#E10600] mb-2">
                  <AnimatedNumber value={5} suffix="+" />
                </h4>
                <p className="text-white/40 text-sm">Anos no mercado</p>
              </div>
              <div>
                <h4 className="text-4xl font-semibold text-[#E10600] mb-2">
                  <AnimatedNumber value={120} suffix="+" />
                </h4>
                <p className="text-white/40 text-sm">Projetos lançados</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
