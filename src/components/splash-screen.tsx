'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Esconde a tela de loading após 2.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.5, 
              ease: "circOut",
            }}
            className="relative perspective-[1000px]"
          >
            <motion.img
              animate={{ rotateY: [0, 360] }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
              src="/logo%20sem%20fundo/logo%20sem%20fundo-mobile.png"
              alt="Overframer"
              className="w-32 md:w-48 h-auto object-contain drop-shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
