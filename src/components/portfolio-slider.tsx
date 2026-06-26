'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  featured: boolean;
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export function PortfolioSlider({ items }: { items: PortfolioItem[] }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }, [index]);

  const prev = () => go(index === 0 ? items.length - 1 : index - 1);
  const next = () => go(index === items.length - 1 ? 0 : index + 1);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setDir(1);
      setIndex(i => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ aspectRatio: '16/7' }}>
      {/* Slides */}
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={item.id}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#111] flex items-center justify-center">
              <span className="text-white/10 text-6xl font-bold">OV</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#E10600] text-xs font-semibold uppercase tracking-widest mb-2"
            >
              {item.category}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-xl md:text-3xl font-semibold mb-2 leading-tight"
            >
              {item.title}
            </motion.h3>
            {item.description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/50 text-sm max-w-xl hidden md:block"
              >
                {item.description}
              </motion.p>
            )}
            {item.projectUrl && (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-white text-xs font-semibold uppercase tracking-wider hover:text-[#E10600] transition-colors"
              >
                Ver projeto
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#E10600] hover:border-[#E10600] transition-all duration-300 z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#E10600] hover:border-[#E10600] transition-all duration-300 z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#E10600]' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
