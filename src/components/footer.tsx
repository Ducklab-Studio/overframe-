'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Início', href: '#' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#portfolio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Equipe', href: '#time' },
  { label: 'FAQ', href: '#faq' },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ducklab_/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Ducklab-Studio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
];

function ContactCard({
  icon, title, subtitle, link, linkLabel, delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  link: string;
  linkLabel: string;
  delay: number;
}) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex-1 min-w-[240px] group bg-[#111]/80 border border-white/8 rounded-2xl p-6 hover:border-[#E10600]/30 hover:bg-[#E10600]/5 transition-all duration-300"
    >
      <div className="mb-4">{icon}</div>
      <p className="text-white font-semibold text-base mb-1">{title}</p>
      <p className="text-white/40 text-sm mb-4">{subtitle}</p>
      <span className="text-[#E10600] text-sm font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
        {linkLabel}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </motion.a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-8">
      {/* Contact cards */}
      <section className="w-full px-6 lg:px-16 xl:px-24 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-white/90 tracking-tight mb-2">
            Fale com a <span className="text-[#E10600]">Overframe</span>
          </h2>
          <p className="text-white/40 text-sm">Respondemos rápido. Escolha o canal que preferir.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4">
          <ContactCard
            delay={0.1}
            title="WhatsApp"
            subtitle="Resposta imediata"
            link="https://wa.me/5587999614464"
            linkLabel="+55 (87) 99961-4464"
            icon={
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(37,162,68,0)', '0 0 18px rgba(37,162,68,0.5)', '0 0 0px rgba(37,162,68,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl border border-[#25A244]/40 bg-[#25A244]/10 flex items-center justify-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="#25A244"/>
                </svg>
              </motion.div>
            }
          />
          <ContactCard
            delay={0.2}
            title="E-mail"
            subtitle="Contato profissional"
            link="mailto:contato@overframe.dev"
            linkLabel="contato@overframe.dev"
            icon={
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(234,67,53,0)', '0 0 18px rgba(234,67,53,0.45)', '0 0 0px rgba(234,67,53,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 }}
                className="w-14 h-14 rounded-2xl border border-[#EA4335]/40 bg-[#EA4335]/10 flex items-center justify-center"
              >
                <svg width="32" height="20" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15H2a2 2 0 0 1-2-2V2.5L5 6.5V15z" fill="#34A853"/>
                  <path d="M19 15h3a2 2 0 0 0 2-2V2.5L19 6.5V15z" fill="#FBBC05"/>
                  <path d="M0 2.5a2 2 0 0 1 3.2-1.6L12 7l8.8-6.1A2 2 0 0 1 24 2.5L12 11 0 2.5z" fill="#EA4335"/>
                  <path d="M5 6.5V15h14V6.5L12 11 5 6.5z" fill="#EA4335" fillOpacity="0.15"/>
                </svg>
              </motion.div>
            }
          />
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Footer body */}
      <div className="w-full px-6 lg:px-16 xl:px-24 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="inline-block mb-5">
              <img
                src="/logo%20sem%20fundo/logo%20sem%20fundo%20maior%20e%20com%20nome-pc.png"
                alt="Overframe"
                loading="lazy"
                decoding="async"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Transformamos ideias em{' '}
              <span className="text-[#E10600]/80">experiências digitais</span>{' '}
              memoráveis que impulsionam negócios e conectam pessoas.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:contato@overframe.dev" className="flex items-center gap-2.5 text-white/40 text-sm hover:text-white/70 transition-colors">
                <svg className="w-4 h-4 text-[#E10600]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                contato@overframe.dev
              </a>
              <a href="https://wa.me/5587999614464" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 text-sm hover:text-white/70 transition-colors">
                <svg className="w-4 h-4 text-[#E10600]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +55 (87) 99961-4464
              </a>
              <span className="flex items-center gap-2.5 text-white/40 text-sm">
                <svg className="w-4 h-4 text-[#E10600]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Brasil — 100% remoto
              </span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-white font-semibold text-sm mb-5 tracking-wide">Links Rápidos</p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/40 text-sm hover:text-[#E10600] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-white font-semibold text-sm mb-2 tracking-wide">Redes Sociais</p>
            <p className="text-white/35 text-sm mb-5">Acompanhe nossas novidades e projetos</p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-[#E10600]/40 hover:bg-[#E10600]/10 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="w-full px-6 lg:px-16 xl:px-24 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            © {year} Overframe. Todos os direitos reservados.
          </p>
        </div>
      </div>

    </footer>
  );
}
