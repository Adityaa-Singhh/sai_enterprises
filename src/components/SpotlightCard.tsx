import React, { useRef, useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
  size?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor,
  borderColor,
  size = 350,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  // Default color themes
  const defaultSpotlight = isDark
    ? 'rgba(0, 229, 255, 0.12)'
    : 'rgba(2, 132, 199, 0.08)';

  const defaultBorder = isDark
    ? 'rgba(0, 229, 255, 0.45)'
    : 'rgba(2, 132, 199, 0.4)';

  const activeSpotlight = spotlightColor || defaultSpotlight;
  const activeBorder = borderColor || defaultBorder;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isDark 
          ? 'bg-dark-1/80 border-white/10 hover:border-transparent' 
          : 'bg-white/70 border-black/5 hover:border-transparent shadow-sm'
      } backdrop-blur-xl ${className}`}
      {...props}
    >
      {/* Background Spotlight illumination */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${activeSpotlight}, transparent 80%)`,
        }}
      />

      {/* Border Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
        style={{
          opacity,
          padding: '1px',
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${activeBorder}, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card Content */}
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};
