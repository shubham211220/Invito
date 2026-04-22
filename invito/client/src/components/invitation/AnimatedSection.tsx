'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

const variants = {
  'fade-up': {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
};

export default function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.7,
  stagger,
  className,
  style,
  once = true,
}: AnimatedSectionProps) {
  const selected = variants[animation];

  const container = stagger
    ? {
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }
    : undefined;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={container || selected}
      transition={!container ? { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
      className={className}
      style={style}
    >
      {stagger
        ? React.Children.map(children, (child) => (
            <motion.div variants={selected} transition={{ duration, ease: [0.25, 0.46, 0.45, 0.94] }}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
