import React from 'react';
import { motion } from 'framer-motion';

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

export const HolographicText: React.FC<HolographicTextProps> = ({
  children,
  className = '',
  variant = 'h1'
}) => {
  const Component = variant as keyof JSX.IntrinsicElements;
  
  const variantClasses = {
    h1: 'text-4xl md:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl font-bold',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
    p: 'text-base md:text-lg'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Component className={`
        ${variantClasses[variant]}
        bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400
        bg-clip-text text-transparent
        hover:from-blue-300 hover:via-purple-300 hover:to-cyan-300
        transition-all duration-300
        ${className}
      `}>
        {children}
      </Component>
    </motion.div>
  );
};