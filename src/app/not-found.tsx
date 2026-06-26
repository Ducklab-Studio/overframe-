'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CircuitLines } from '@/components/circuit-lines';

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function trigger() {
      setOffset({ x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 4 });
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
      setTimeout(trigger, 2500 + Math.random() * 2000);
    }
    const t = setTimeout(trigger, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Circuit background */}
      <div className="absolute inset-0 opacity-50">
        <CircuitLines />
      </div>

      {/* Red radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(225,6,0,0.07) 0%, transparent 70%)' }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)' }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 select-none">

        {/* 404 with glitch */}
        <div className="relative mb-4">
          {/* Glitch layer cyan */}
          {glitch && (
            <span
              aria-hidden
              className="absolute inset-0 text-[clamp(120px,25vw,220px)] font-black leading-none tracking-tighter"
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px #00eeff',
                opacity: 0.6,
                transform: `translate(4px, -2px)`,
                clipPath: 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)',
              }}
            >404</span>
          )}
          {/* Glitch layer magenta */}
          {glitch && (
            <span
              aria-hidden
              className="absolute inset-0 text-[clamp(120px,25vw,220px)] font-black leading-none tracking-tighter"
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px #ff00cc',
                opacity: 0.6,
                transform: `translate(-4px, 2px)`,
                clipPath: 'polygon(0 60%, 100% 60%, 100% 82%, 0 82%)',
              }}
            >404</span>
          )}

          {/* Main 404 */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(120px,25vw,220px)] font-black leading-none tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: glitch ? '2px #ff2020' : '2px #E10600',
              textShadow: glitch
                ? '0 0 40px rgba(225,6,0,1), 0 0 80px rgba(225,6,0,0.5)'
                : '0 0 60px rgba(225,6,0,0.35), 0 0 120px rgba(225,6,0,0.1)',
              transform: glitch ? `translate(${offset.x}px, ${offset.y}px)` : 'none',
              transition: glitch ? 'none' : 'text-shadow 0.3s, transform 0.3s',
            }}
          >
            404
          </motion.h1>
        </div>

        {/* Red line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-px bg-[#E10600] mb-7"
          style={{ boxShadow: '0 0 12px rgba(225,6,0,0.8)' }}
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-white text-2xl md:text-3xl font-bold mb-3 tracking-tight"
        >
          Página não encontrada
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-white/35 text-sm md:text-base max-w-xs mb-10 leading-relaxed"
        >
          A rota que você tentou acessar não existe ou foi removida.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#E10600] text-white font-semibold text-sm hover:bg-[#c00500] transition-all duration-300 group"
            style={{ boxShadow: '0 0 0 rgba(225,6,0,0)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(225,6,0,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 rgba(225,6,0,0)')}
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Voltar ao início
          </Link>

          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white transition-all duration-300"
          >
            Ver projetos
          </Link>
        </motion.div>

        {/* System label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-12 text-white/12 text-[10px] font-mono tracking-[0.25em] uppercase"
        >
          OVERFRAME_SYS :: ERR_ROUTE_NOT_FOUND
        </motion.p>
      </div>
    </div>
  );
}
