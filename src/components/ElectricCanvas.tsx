import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ElectricCanvasProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  pulseSpeed: number;
  pulseVal: number;
}

interface Spark {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const ElectricCanvas: React.FC<ElectricCanvasProps> = ({
  className = '',
  particleCount = 55,
  connectionDistance = 140,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const isDark = resolvedTheme === 'dark';

    // Color definitions based on theme
    const primaryColor = isDark ? '0, 229, 255' : '2, 132, 199'; // Volt Cyan or Cobalt Blue
    const secondaryColor = isDark ? '59, 130, 246' : '14, 165, 233'; // Electric Blue or Sky Blue
    const sparkColor = isDark ? '#ffffff' : '#0284c7';

    // Particle state
    const particles: Particle[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: -1000, y: -1000, active: false, radius: 180 };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      particles.length = 0;
      const count = width < 768 ? Math.floor(particleCount * 0.55) : particleCount;

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.75,
          vy: (Math.random() - 0.5) * 0.75,
          radius,
          baseRadius: radius,
          alpha: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulseVal: Math.random() * Math.PI * 2,
        });
      }
    };

    // Trigger occasional electric spark between connected nodes
    const maybeCreateSpark = (from: number, to: number) => {
      if (sparks.length > 8 || Math.random() > 0.03) return;
      sparks.push({
        fromIndex: from,
        toIndex: to,
        progress: 0,
        speed: Math.random() * 0.04 + 0.02,
        color: sparkColor,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    const onTouchEnd = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Pulse size
        p.pulseVal += p.pulseSpeed;
        const pulse = Math.sin(p.pulseVal);
        p.radius = p.baseRadius + pulse * 0.8;

        // Mouse magnetic attraction
        if (interactive && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Draw particle node with glow
        const nodeAlpha = Math.min(1, Math.max(0.2, p.alpha + pulse * 0.25));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, ${nodeAlpha})`;
        ctx.shadowColor = `rgba(${primaryColor}, ${isDark ? 0.8 : 0.4})`;
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw Connections & Trigger Sparks
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const lineAlpha = (1 - dist / connectionDistance) * (isDark ? 0.28 : 0.2);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${secondaryColor}, ${lineAlpha})`;
            ctx.lineWidth = (1 - dist / connectionDistance) * 1.3;
            ctx.stroke();

            // Chance to create electrical pulse spark
            if (dist < connectionDistance * 0.65) {
              maybeCreateSpark(i, j);
            }
          }
        }

        // Mouse connection line
        if (interactive && mouse.active) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const mouseAlpha = (1 - dist / mouse.radius) * (isDark ? 0.45 : 0.35);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${primaryColor}, ${mouseAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        const p1 = particles[spark.fromIndex];
        const p2 = particles[spark.toIndex];

        if (!p1 || !p2) {
          sparks.splice(s, 1);
          continue;
        }

        spark.progress += spark.speed;
        if (spark.progress >= 1) {
          sparks.splice(s, 1);
          continue;
        }

        const currentX = p1.x + (p2.x - p1.x) * spark.progress;
        const currentY = p1.y + (p2.y - p1.y) * spark.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, isDark ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = isDark ? 10 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    initParticles();
    render();

    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [resolvedTheme, particleCount, connectionDistance, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
