'use client';

import { motion } from 'framer-motion';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {posts.map((post, i) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="group cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="w-full aspect-video rounded-xl md:rounded-2xl bg-[#111] border border-white/5 overflow-hidden mb-3">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/10 text-base md:text-2xl font-bold">OV</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1 px-0.5">
            {formatDate(post.publishedAt) && (
              <p className="text-white/25 text-[10px] md:text-xs">{formatDate(post.publishedAt)}</p>
            )}
            <h3 className="text-[#F2F2F2] font-medium text-xs md:text-base leading-snug group-hover:text-[#E10600] transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-white/35 text-xs leading-relaxed line-clamp-2 hidden md:block">{post.excerpt}</p>
            )}
            <p className="text-[#E10600] text-[10px] md:text-xs font-medium pt-0.5">Ler →</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
