import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  pulsePhase: number;
}

interface AdaptiveParticlesProps {
  phase: 'waiting' | 'onset' | 'peak' | 'comedown';
  intensity: number; // 0-1, how close to peak
  historicalPeakTime?: number; // Historical average peak time in ms
  currentTime: number; // Current elapsed time in ms
}

export const AdaptiveParticles: React.FC<AdaptiveParticlesProps> = ({
  phase,
  intensity,
  historicalPeakTime,
  currentTime
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  // Phase-based configuration
  const config = useMemo(() => {
    switch (phase) {
      case 'waiting':
        return {
          particleCount: 5,
          speed: 0.2,
          hue: 200, // Blue
          opacity: 0.3,
          pulseSpeed: 0.02
        };
      case 'onset':
        return {
          particleCount: 15,
          speed: 0.5,
          hue: 50, // Yellow
          opacity: 0.4,
          pulseSpeed: 0.03
        };
      case 'peak':
        return {
          particleCount: 50,
          speed: 1.2,
          hue: 120, // Green
          opacity: 0.6,
          pulseSpeed: 0.05
        };
      case 'comedown':
        return {
          particleCount: 10,
          speed: 0.3,
          hue: 280, // Purple
          opacity: 0.35,
          pulseSpeed: 0.025
        };
    }
  }, [phase]);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initParticles = () => {
      const particles: Particle[] = [];
      const targetCount = Math.floor(config.particleCount * (0.5 + intensity * 0.5));
      
      for (let i = 0; i < targetCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          radius: Math.random() * 3 + 1,
          opacity: config.opacity * (0.5 + Math.random() * 0.5),
          hue: config.hue + (Math.random() - 0.5) * 20,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      
      particlesRef.current = particles;
    };

    initParticles();

    // Adjust particle count smoothly
    const interval = setInterval(() => {
      const targetCount = Math.floor(config.particleCount * (0.5 + intensity * 0.5));
      const currentCount = particlesRef.current.length;
      
      if (currentCount < targetCount) {
        // Add particles
        for (let i = 0; i < Math.min(3, targetCount - currentCount); i++) {
          particlesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * config.speed,
            vy: (Math.random() - 0.5) * config.speed,
            radius: Math.random() * 3 + 1,
            opacity: 0, // Fade in
            hue: config.hue + (Math.random() - 0.5) * 20,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
      } else if (currentCount > targetCount) {
        // Remove particles
        particlesRef.current = particlesRef.current.slice(0, targetCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config, intensity]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Update opacity (fade in/out)
        const targetOpacity = config.opacity * (0.5 + Math.random() * 0.5);
        particle.opacity += (targetOpacity - particle.opacity) * 0.05;

        // Pulse effect
        particle.pulsePhase += config.pulseSpeed;
        const pulseFactor = 0.5 + Math.sin(particle.pulsePhase) * 0.5;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        
        const alpha = particle.opacity * pulseFactor;
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${alpha})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 50%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 40%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${alpha * 1.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles (neural network effect)
      if (phase === 'peak' || phase === 'onset') {
        ctx.strokeStyle = `hsla(${config.hue}, 60%, 50%, 0.1)`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p1 = particlesRef.current[i];
            const p2 = particlesRef.current[j];
            const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.2 * intensity;
              ctx.strokeStyle = `hsla(${config.hue}, 60%, 50%, ${opacity})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, config, intensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};