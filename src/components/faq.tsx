'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealText } from '@/components/reveal-text';

const FAQS = [
  { q: 'Quanto tempo leva para entregar um projeto?', a: 'Depende do escopo. Uma landing page leva de 5 a 7 dias úteis. Sites completos e plataformas variam entre 2 a 6 semanas. Alinhamos o prazo exato no briefing inicial.' },
  { q: 'Como funciona o processo de trabalho?', a: 'Seguimos 4 etapas: Briefing → Design → Desenvolvimento → Entrega. Você acompanha cada fase com revisões e aprovações. Comunicação direta, sem burocracia.' },
  { q: 'Vocês trabalham com clientes de todo o Brasil?', a: 'Sim! Somos 100% remotos e atendemos clientes em todo o Brasil e exterior. Toda comunicação é feita por WhatsApp, Notion e reuniões por vídeo.' },
  { q: 'O que está incluso no suporte pós-entrega?', a: 'Oferecemos 30 dias de suporte gratuito após a entrega para ajustes e dúvidas. Para suporte contínuo, temos planos mensais de manutenção.' },
  { q: 'Posso solicitar alterações durante o projeto?', a: 'Sim, dentro das revisões previstas no contrato. Cada pacote inclui rodadas de revisão. Alterações além do escopo são orçadas separadamente.' },
  { q: 'Trabalham com qual tecnologia?', a: 'Principalmente Next.js, React, TypeScript e PostgreSQL no fullstack. Para design usamos Figma. Sempre escolhemos a stack mais adequada para o seu projeto.' },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`border-b border-white/5 last:border-0`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-6 text-left gap-6 group"
      >
        <span className={`text-base font-medium transition-colors duration-300 ${open ? 'text-[#E10600]' : 'text-white/80 group-hover:text-white'}`}>{q}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${open ? 'border-[#E10600] bg-[#E10600]/10 rotate-45' : 'border-white/10 group-hover:border-white/30'}`}>
          <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-white/40 text-sm leading-relaxed pb-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <RevealText as="h2" className="text-3xl md:text-5xl font-medium text-[#F2F2F2] tracking-tight mb-4">
            Dúvidas <span className="text-white/40">frequentes</span>
          </RevealText>
          <p className="text-white/30 text-lg">Respondemos as perguntas mais comuns.</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-3xl px-8">
          {FAQS.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
