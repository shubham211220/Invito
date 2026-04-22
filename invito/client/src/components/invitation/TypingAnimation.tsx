'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  style?: React.CSSProperties;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
}

export default function TypingAnimation({
  text,
  speed = 35,
  style,
  className,
  as = 'p',
}: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [inView, text, speed]);

  const Tag = as;

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <Tag className={className} style={style}>
        {displayed}
        {!done && <span className="typing-cursor">&nbsp;</span>}
      </Tag>
    </motion.div>
  );
}
