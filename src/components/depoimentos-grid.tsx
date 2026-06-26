'use client';

import { motion, useRef } from 'framer-motion';
import { useState } from 'react';

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[#E10600]' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function DepoimentosGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col hover:border-[#E10600]/20 transition-colors duration-500"
        >
          <StarRating rating={item.rating} />
          <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">"{item.content}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E10600]/10 border border-[#E10600]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#E10600] font-semibold text-sm">{item.name[0]}</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{item.name}</p>
              <p className="text-white/30 text-xs">{item.role}{item.company && ` · ${item.company}`}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
