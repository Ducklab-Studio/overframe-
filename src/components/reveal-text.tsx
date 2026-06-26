'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export const RevealText = ({
  children,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: RevealTextProps) => {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ willChange: 'clip-path' }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
};
