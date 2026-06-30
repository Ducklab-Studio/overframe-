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

/* ─── Cloudinary & embed helpers ───────────────────────────── */
function cloudinaryOpt(url: string, transforms = 'f_auto,q_auto') {
  if (!url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/${transforms}/`);
}

// Para vídeo: injeta o transform E troca a extensão, senão o Cloudinary
// entrega o formato da extensão original e ignora o f_ (quebra no Safari).
function cloudinaryVideo(url: string, transforms: string, ext: 'mp4' | 'webm') {
  if (!url.includes('res.cloudinary.com')) return url;
  return url
    .replace('/upload/', `/upload/${transforms}/`)
    .replace(/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i, `.${ext}`);
}

function cloudinaryPoster(videoUrl: string) {
  if (!videoUrl.includes('res.cloudinary.com')) return '';
  return videoUrl
    .replace('/video/upload/', '/video/upload/f_jpg,q_auto,so_0/')
    .replace(/\.(mp4|webm|mov)(\?.*)?$/, '.jpg');
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return m?.[1] ?? null;
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] ?? null;
}

function isDirectVideo(url: string) {
  return url.includes('res.cloudinary.com') || /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

/* ─── Media para o Modal (vídeo completo) ───────────────────── */
function ModalMedia({ item }: { item: PortfolioItem }) {
  const video = item.videoUrl;
  const image = item.imageUrl;

  if (video) {
    const ytId = getYouTubeId(video);
    const viId = getVimeoId(video);

    if (ytId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?controls=1`}
          className="w-full h-full"
          allow="fullscreen"
          allowFullScreen
        />
      );
    }

    if (viId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${viId}`}
          className="w-full h-full"
          allow="fullscreen"
          allowFullScreen
        />
      );
    }

    if (isDirectVideo(video)) {
      const poster = image ? cloudinaryOpt(image, 'f_auto,q_auto:good,w_900') : cloudinaryPoster(video);
      const isCloudinary = video.includes('res.cloudinary.com');
      return (
        <video
          poster={poster || undefined}
          playsInline
          controls
          preload="metadata"
          x-webkit-airplay="allow"
          className="w-full h-full object-cover"
        >
          {isCloudinary ? (
            <>
              {/* MP4 H.264 primeiro — único codec garantido no Safari iOS/macOS */}
              <source src={cloudinaryVideo(video, 'q_auto,vc_h264,ac_aac', 'mp4')} type="video/mp4" />
              {/* WebM para Chrome/Firefox — menor, mas só usado se o browser preferir */}
              <source src={cloudinaryVideo(video, 'q_auto', 'webm')} type="video/webm" />
            </>
          ) : (
            <source src={video} />
          )}
        </video>
      );
    }
  }

  if (image) {
    return (
      <img
        src={cloudinaryOpt(image, 'f_auto,q_auto:good,w_900')}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-white/10 text-6xl font-bold">OV</span>
    </div>
  );
}

/* ─── Media para o Card (thumbnail estático) ────────────────── */
function CardMedia({ item }: { item: PortfolioItem }) {
  const video = item.videoUrl;
  const image = item.imageUrl;
  const hasVideo = !!video;

  const thumbnail = (() => {
    if (image) return cloudinaryOpt(image, 'f_auto,q_auto,w_600');
    if (video && isDirectVideo(video)) return cloudinaryPoster(video);
    if (video && getYouTubeId(video)) return `https://img.youtube.com/vi/${getYouTubeId(video)}/hqdefault.jpg`;
    return '';
  })();

  return (
    <div className="relative w-full h-full">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/10 text-4xl font-bold">OV</span>
        </div>
      )}
      {/* Badge de tipo no canto superior esquerdo */}
      <div className="absolute top-2.5 left-2.5 z-10">
        {hasVideo ? (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E10600] text-white text-[10px] font-bold shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Vídeo
          </span>
        ) : thumbnail ? (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-black text-[10px] font-bold shadow-lg">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21"/></svg>
            Foto
          </span>
        ) : null}
      </div>
      {hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-black/70 transition-all duration-300">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
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
    day: '2-digit', month: '2-digit', year: 'numeric',
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
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111111] border border-white/10 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Mídia */}
          <div className="relative w-full aspect-[16/8] overflow-hidden rounded-t-2xl bg-[#0a0a0a]">
            <ModalMedia item={item} />
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
            <span className="inline-block px-3 py-1 rounded-full bg-[#00C2FF]/15 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-semibold mb-4">
              {item.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{item.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start">
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Sobre o Projeto</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description || 'Nenhuma descrição disponível.'}
                </p>
              </div>
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

            {item.technologies && item.technologies.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-semibold text-sm mb-3">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map(tech => (
                    <span key={tech} className="px-4 py-1.5 rounded-full border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 transition-colors">
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
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group cursor-pointer flex flex-col rounded-2xl border border-[#E10600]/15 bg-[#0f0f0f] hover:border-[#E10600]/40 hover:shadow-[0_0_30px_rgba(225,6,0,0.12)] transition-all duration-300 overflow-hidden"
      style={{ willChange: 'transform' }}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
        <CardMedia item={item} />
      </div>

      <div className="flex flex-col flex-1 p-4 md:p-5">
        <div className="mb-3 md:mb-4">
          <span className="inline-block px-2.5 py-1 rounded-full bg-[#E10600]/15 border border-[#E10600]/30 text-[#E10600] text-[10px] md:text-xs font-semibold uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg md:text-xl mb-2 group-hover:text-white/90 transition-colors leading-tight">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-white/45 text-xs md:text-sm leading-relaxed line-clamp-3 mb-4 md:mb-5 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-[#E10600]/10">
          <div className="flex items-center gap-1.5 text-white/35 text-[10px] md:text-xs font-medium">
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">{date}</span>
            <span className="sm:hidden">{date.slice(0, 5)}</span>
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

type Filter = 'all' | 'image' | 'video';

/* ─── Grid principal ────────────────────────────────────────── */
export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');

  const videoCount = items.filter(i => !!i.videoUrl).length;
  const imageCount = items.filter(i => !i.videoUrl && !!i.imageUrl).length;

  const filteredItems = items.filter(item => {
    if (filter === 'video') return !!item.videoUrl;
    if (filter === 'image') return !item.videoUrl;
    return true;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) setCurrentPage(totalPages - 1);
    else if (totalPages === 0) setCurrentPage(0);
  }, [filteredItems.length, totalPages, currentPage]);

  useEffect(() => { setCurrentPage(0); }, [filter]);

  const currentItems = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const allFilterTabs: { id: Filter; label: string; count: number; icon: string }[] = [
    { id: 'all',   label: 'Todos',   count: items.length, icon: '◈' },
    { id: 'video', label: 'Vídeos',  count: videoCount,   icon: '▶' },
    { id: 'image', label: 'Fotos',   count: imageCount,   icon: '◻' },
  ];
  const filterTabs = allFilterTabs.filter(t => t.id === 'all' || t.count > 0);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Filtros — sempre visíveis quando há itens */}
      {items.length > 0 && filterTabs.length > 1 && (
        <div className="flex items-center gap-2 mb-8 self-start flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === tab.id
                  ? 'bg-[#E10600] text-white shadow-[0_0_16px_rgba(225,6,0,0.35)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10'
              }`}
            >
              <span className="text-[11px]">{tab.icon}</span>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-white/40'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}
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
              <ProjectCard key={item.id} item={item} index={index} onClick={() => setSelected(item)} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage === 0 ? 'border-white/5 text-white/20 cursor-not-allowed bg-transparent' : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-[#111]'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`transition-all duration-300 rounded-full ${currentPage === idx ? 'w-6 h-2 bg-[#E10600]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Página ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage === totalPages - 1 ? 'border-white/5 text-white/20 cursor-not-allowed bg-transparent' : 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-[#111]'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {selected && <ProjectModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
