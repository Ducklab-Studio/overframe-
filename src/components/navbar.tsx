'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitLines } from './circuit-lines';

const NAV_LINKS = [
  { label: 'Início', href: '#' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#portfolio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Equipe', href: '#time' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll spy: a seção ativa é aquela cujo topo está mais perto do topo do viewport
      // (maior rect.top que ainda seja <= threshold)
      const THRESHOLD = 120; // px abaixo do topo da navbar
      const sections = NAV_LINKS.map(link => link.href.substring(1)).filter(Boolean);
      let current = '#';
      let maxTop = -Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Seção já passou pelo topo E é a mais recente a passar
          if (rect.top <= THRESHOLD && rect.top > maxTop) {
            maxTop = rect.top;
            current = `#${section}`;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? 'py-4' : 'py-4 md:py-6'
      }`}
    >
      <div className={`transition-all duration-500 w-full px-6 lg:px-12 flex justify-center ${isScrolled ? 'max-w-[1000px]' : 'max-w-7xl'}`}>
        <div
          className={`w-full flex items-center justify-between transition-all duration-500 rounded-full ${
            isScrolled
              ? 'bg-[#0f1115]/50 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 py-2'
              : 'bg-transparent border border-transparent px-0 py-0'
          }`}
        >
          {/* Logo */}
          <Link href="/" className={`flex-shrink-0 transition-all duration-300 ${isScrolled ? 'lg:hidden ml-4' : ''}`}>
            {/* Mobile: só ícone (maior) */}
            <img
              src="/logo%20sem%20fundo/logo%20sem%20fundo-mobile.png"
              alt="Overframe Logo"
              fetchPriority="high"
              decoding="async"
              className="h-16 w-auto object-contain lg:hidden"
            />
            {/* Desktop: ícone + nome */}
            <img
              src="/logo%20sem%20fundo/logo%20sem%20fundo%20maior%20e%20com%20nome-pc.png"
              alt="Overframe Logo"
              fetchPriority="high"
              decoding="async"
              className="h-20 w-auto object-contain hidden lg:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center justify-center flex-1 transition-all duration-300 ${isScrolled ? 'gap-2' : 'gap-6'}`}>
            {NAV_LINKS.map((link) => {
              const isActive = isScrolled && activeSection === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#E10600]/20 text-[#ffb3b3] font-semibold border border-[#E10600]/30'
                      : isScrolled
                      ? 'text-white/60 hover:text-white hover:bg-white/5'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Botão Contato (Desktop) */}
          <div className="hidden lg:block flex-shrink-0">
            <a
              href="https://wa.me/5587999614464"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full font-semibold text-sm transition-all duration-300 bg-[#E10600] text-[#F2F2F2] px-6 py-2.5 hover:bg-[#b00500]"
            >
              Contato
              {isScrolled && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 mr-2 ${isScrolled ? 'text-white' : 'text-[#E10600]'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-[1.5px] bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-current transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-[1.5px] bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[75%] z-50 rounded-bl-3xl overflow-hidden"
            >
              {/* Animated circuit lines background */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
                <CircuitLines />
              </div>

              {/* Subtle border overlay */}
              <div className="absolute inset-0 border-l border-b border-white/10 rounded-bl-3xl pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                  <span className="text-white/50 text-sm font-medium tracking-widest uppercase">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                    aria-label="Fechar menu"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                <div className="px-6 py-8 flex flex-col gap-6 flex-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white/80 text-lg font-medium hover:text-[#E10600] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="px-6 pb-10">
                  <motion.a
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    href="https://wa.me/5587999614464"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-[#E10600] text-white px-6 py-3 rounded-full font-semibold text-center w-full hover:bg-[#b00500] transition-colors flex items-center justify-center gap-2"
                  >
                    Contato via WhatsApp
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
