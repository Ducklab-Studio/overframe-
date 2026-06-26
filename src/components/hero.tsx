'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// ── Variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const wordVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const fadeUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

// ── Split Word Title ──────────────────────────────────────
const HEADLINE = 'Elevando marcas ao seu potencial máximo';
const words = HEADLINE.split(' ');

// ── Parallax elements ─────────────────────────────────────
interface ParallaxItemDef {
  size: number; speed: number; top: string; left: string;
  color: string; blur: number; translate: string;
}

function ParallaxItem({ el, mouseX, mouseY }: { el: ParallaxItemDef; mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const x = useTransform(mouseX, (v) => v * el.speed);
  const y = useTransform(mouseY, (v) => v * el.speed);
  return (
    <motion.div
      style={{
        x, y,
        position: 'absolute',
        top: el.top,
        left: el.left,
        translate: el.translate,
        width: el.size,
        height: el.size,
        background: el.color,
        borderRadius: '50%',
        filter: `blur(${el.blur}px)`,
      }}
    />
  );
}

const PARALLAX_ITEMS: ParallaxItemDef[] = [
  { size: 600, speed: 0.02, top: '50%', left: '50%', color: 'rgba(225,6,0,0.15)', blur: 120, translate: '-50%,-50%' },
  { size: 300, speed: 0.04, top: '20%', left: '75%', color: 'rgba(225,6,0,0.08)', blur: 80, translate: '-50%,-50%' },
  { size: 200, speed: 0.06, top: '70%', left: '20%', color: 'rgba(242,242,242,0.03)', blur: 60, translate: '-50%,-50%' },
  { size: 150, speed: -0.03, top: '30%', left: '10%', color: 'rgba(225,6,0,0.06)', blur: 50, translate: '-50%,-50%' },
  { size: 100, speed: -0.05, top: '80%', left: '80%', color: 'rgba(242,242,242,0.03)', blur: 40, translate: '-50%,-50%' },
];

// ── Typewriter ────────────────────────────────────────────
const PHRASES = [
  "Design Minimalista & Tecnologia de Ponta",
  "Criamos Experiências que Convertem",
  "Sua Marca no Próximo Nível"
];

const Typewriter = () => {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = PHRASES[phraseIndex];
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      timeoutId = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    } else {
      const nextText = isDeleting
        ? currentPhrase.substring(0, text.length - 1)
        : currentPhrase.substring(0, text.length + 1);
        
      const delay = isDeleting ? 40 : 80;
      timeoutId = setTimeout(() => setText(nextText), delay);
    }

    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, phraseIndex]);

  return (
    <span className="text-[#E10600] text-xs font-medium tracking-wide">
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
        className="ml-[1px] inline-block"
      >
        |
      </motion.span>
    </span>
  );
};

export const Hero = () => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        rawX.set(e.clientX - cx);
        rawY.set(e.clientY - cy);
        rafId = null;
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY]);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">

      {/* Parallax Background Elements — desktop only */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        {PARALLAX_ITEMS.map((el, i) => (
          <ParallaxItem key={i} el={el} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Static glow for mobile */}
      <div className="absolute inset-0 pointer-events-none z-0 md:hidden">
        <div style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50% -50%', width: 300, height: 300, background: 'rgba(225,6,0,0.12)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E10600]/20 bg-[#E10600]/5 backdrop-blur-md mb-8 h-[34px]"
        >
          <div className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
          <Typewriter />
        </motion.div>

        {/* Split Word Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-semibold text-[#F2F2F2] tracking-tight leading-[1.1] mb-8"
          aria-label={HEADLINE}
        >
          {words.map((word, i) => {
            const isHighlight = i >= 4;
            return (
              <motion.span
                key={i}
                variants={wordVariants}
                style={{ display: 'inline-block' }}
                className={`mr-[0.25em] ${
                  isHighlight
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E10600]'
                    : ''
                }`}
              >
                {word}
              </motion.span>
            );
          })}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.9}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-white/50 text-lg md:text-xl font-normal leading-relaxed mb-12"
        >
          Criamos experiências digitais limpas, modernas e focadas em conversão.
          Sem excessos, apenas o que realmente importa.
        </motion.p>

        {/* Buttons */}
        <motion.div
          custom={1.1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="#portfolio"
            className="px-8 py-4 bg-[#E10600] text-[#F2F2F2] rounded-full font-medium text-sm hover:scale-105 hover:bg-[#b00500] hover:shadow-[0_0_30px_rgba(225,6,0,0.4)] transition-all duration-300 ease-out"
          >
            Nossos Projetos
          </Link>
          <Link
            href="#contato"
            className="px-8 py-4 bg-transparent border border-[#E10600]/30 text-[#F2F2F2] rounded-full font-medium text-sm hover:bg-[#E10600]/10 transition-colors duration-300"
          >
            Fale com a equipe
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
