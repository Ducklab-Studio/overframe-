'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  projectUrl: string | null;
  featured: boolean;
  technologies: string[];
  createdAt: string;
}

/* ─── Modal de detalhes ─────────────────────────────────────── */
function ProjectModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const date = new Date(item.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111111] border border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Mídia do projeto */}
          <div className="relative w-full aspect-[16/8] overflow-hidden rounded-t-2xl bg-[#0a0a0a]">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : item.videoUrl ? (
              <video
                src={item.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/10 text-6xl font-bold">OV</span>
              </div>
            )}
            {/* Fechar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200 z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-6 md:p-8">
            {/* Badge de categoria */}
            <span className="inline-block px-3 py-1 rounded-full bg-[#00C2FF]/15 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-semibold mb-4">
              {item.category}
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {item.title}
            </h2>

            {/* Grid: descrição + data/link */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
              {/* Descrição */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Sobre o Projeto</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description || 'Nenhuma descrição disponível.'}
                </p>
              </div>

              {/* Data + Botão */}
              <div className="flex flex-col gap-4 min-w-[160px]">
                <div>
                  <p className="text-white/40 text-xs mb-1">Data</p>
                  <p className="text-white font-semibold text-sm">{date}</p>
                </div>
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 group"
                  >
                    Ver Projeto Online
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Tecnologias */}
            {item.technologies && item.technologies.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold text-sm mb-3">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map(tech => (
                    <span
                      key={tech}
                      className="px-4 py-1.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Card do projeto ───────────────────────────────────────── */
function ProjectCard({ item, index, onClick }: { item: PortfolioItem; index: number; onClick: () => void }) {
  const date = new Date(item.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col rounded-2xl border border-[#E10600]/15 bg-[#0f0f0f] hover:border-[#E10600]/40 hover:shadow-[0_0_30px_rgba(225,6,0,0.12)] transition-all duration-300 overflow-hidden"
      style={{ willChange: 'transform' }}
      onClick={onClick}
    >
      {/* Mídia */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
        ) : item.videoUrl ? (
          <video
            src={item.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/10 text-4xl font-bold">OV</span>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        {/* Badge de categoria (Tema Overframe: Vermelho) */}
        <div className="mb-3 md:mb-4">
          <span className="inline-block px-2.5 py-1 rounded-full bg-[#E10600]/15 border border-[#E10600]/30 text-[#E10600] text-[10px] md:text-xs font-semibold uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-white font-bold text-lg md:text-xl mb-2 group-hover:text-white/90 transition-colors leading-tight">
          {item.title}
        </h3>

        {/* Descrição */}
        {item.description && (
          <p className="text-white/45 text-xs md:text-sm leading-relaxed line-clamp-3 mb-4 md:mb-5 flex-1">
            {item.description}
          </p>
        )}

        {/* Rodapé do card */}
        <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-[#E10600]/10">
          <div className="flex items-center gap-1.5 text-white/35 text-[10px] md:text-xs font-medium">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">{date}</span>
            <span className="sm:hidden">{date.slice(0,5)}</span>
          </div>
          <span className="text-white/60 text-[10px] md:text-xs font-semibold group-hover:text-white transition-colors flex items-center gap-1 md:gap-1.5">
            <span className="hidden sm:inline">Ver Detalhes</span>
            <span className="sm:hidden">Ver</span>
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Grid principal ────────────────────────────────────────── */
export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Garantir que a página atual é válida se o número de items mudar
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [items.length, totalPages, currentPage]);

  const currentItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(p => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-3 md:gap-5 w-full ${
              currentItems.length === 1 ? 'grid-cols-2 md:grid-cols-1 max-w-[400px] mx-auto' : 
              currentItems.length === 2 ? 'grid-cols-2 max-w-[800px] mx-auto' : 
              'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {currentItems.map((item, index) => (
              <ProjectCard
                key={item.id}
                item={item}
                index={index}
                onClick={() => setSelected(item)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center gap-6 mt-12">
          {/* Seta Esquerda */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
              currentPage === 0 
                ? 'border-white/5 text-white/20 cursor-not-allowed bg-transparent' 
                : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-[#111]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentPage === idx 
                    ? 'w-6 h-2 bg-[#E10600]' 
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Página ${idx + 1}`}
              />
            ))}
          </div>

          {/* Seta Direita */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
              currentPage === totalPages - 1
                ? 'border-white/5 text-white/20 cursor-not-allowed bg-transparent' 
                : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-[#111]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {selected && (
        <ProjectModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
