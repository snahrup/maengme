import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleFieldProps {
  intensity?: number;
  interactive?: boolean;
  colorScheme?: 'blue' | 'purple' | 'mixed' | 'aurora';
  depth?: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'ambient' | 'spark' | 'floater' | 'orbiter';
  angle?: number;
  radius?: number;
  centerX?: number;
  centerY?: number;
  pulsePhase?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  intensity = 1,
  interactive = true,
  colorScheme = 'mixed',
  depth = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Color palettes
  const colorPalettes = {
    blue: ['#1DA1FF', '#0080FF', '#0066CC', '#4DB8FF', '#00B3E6'],
    purple: ['#7B61FF', '#6B51E5', '#9B81FF', '#B794F6', '#D6BCFA'],
    mixed: ['#1DA1FF', '#7B61FF', '#FF61DC', '#00D9FF', '#FFD700'],
    aurora: ['#00FF9F', '#00D9FF', '#7B61FF', '#FF61DC', '#FFE74D']
  };

  const getRandomColor = () => {
    const palette = colorPalettes[colorScheme];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = [];
    const particleCount = Math.floor(100 * intensity);
    
    for (let i = 0; i < particleCount; i++) {
      const type = Math.random() < 0.6 ? 'ambient' : 
                   Math.random() < 0.8 ? 'floater' :
                   Math.random() < 0.95 ? 'spark' : 'orbiter';
      
      const particle: Particle = {
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        z: depth ? Math.random() * 200 - 100 : 0,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.2,
        size: type === 'spark' ? 1 + Math.random() * 2 : 
              type === 'orbiter' ? 2 + Math.random() * 3 :
              0.5 + Math.random() * 2,
        color: getRandomColor(),
        opacity: type === 'spark' ? 0.8 + Math.random() * 0.2 :
                 type === 'orbiter' ? 0.6 + Math.random() * 0.3 :
                 0.3 + Math.random() * 0.4,
        life: 0,
        maxLife: 200 + Math.random() * 300,
        type,
        pulsePhase: Math.random() * Math.PI * 2
      };
      
      // Special properties for orbiters
      if (type === 'orbiter') {
        particle.centerX = Math.random() * dimensions.width;
        particle.centerY = Math.random() * dimensions.height;
        particle.radius = 50 + Math.random() * 100;
        particle.angle = Math.random() * Math.PI * 2;
      }
      
      particles.push(particle);
    }
    
    particlesRef.current = particles;
  }, [intensity, dimensions, colorScheme, depth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const { width, height } = parent.getBoundingClientRect();
      setDimensions({ width, height });
      
      canvas.width = width;
      canvas.height = height;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking for interactivity
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      timeRef.current += 0.016;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create subtle gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      bgGradient.addColorStop(0, 'rgba(11, 18, 32, 0)');
      bgGradient.addColorStop(1, 'rgba(11, 18, 32, 0.02)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update life
        particle.life++;
        
        // Respawn dead particles
        if (particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = depth ? Math.random() * 200 - 100 : 0;
          particle.life = 0;
          particle.opacity = particle.type === 'spark' ? 0.8 : 0.3 + Math.random() * 0.4;
          particle.color = getRandomColor();
        }
        
        // Update based on type
        switch (particle.type) {
          case 'ambient':
            // Gentle floating motion
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01 - 0.001; // Slight upward bias
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            break;
            
          case 'floater':
            // Sinusoidal floating
            particle.vy = Math.sin(timeRef.current + particle.pulsePhase!) * 0.5;
            particle.vx = Math.cos(timeRef.current * 0.5 + particle.pulsePhase!) * 0.3;
            break;
            
          case 'spark':
            // Fast, erratic movement
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // Fade out quickly
            if (particle.life > particle.maxLife * 0.7) {
              particle.opacity *= 0.95;
            }
            break;
            
          case 'orbiter':
            // Orbital motion
            if (particle.angle !== undefined && particle.radius !== undefined) {
              particle.angle += 0.01;
              const targetX = particle.centerX! + Math.cos(particle.angle) * particle.radius;
              const targetY = particle.centerY! + Math.sin(particle.angle) * particle.radius;
              
              particle.vx = (targetX - particle.x) * 0.05;
              particle.vy = (targetY - particle.y) * 0.05;
            }
            break;
        }
        
        // Mouse interaction
        if (interactive && mouseRef.current.active) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            const angle = Math.atan2(dy, dx);
            
            // Particles are repelled by mouse
            particle.vx -= Math.cos(angle) * force * 0.5;
            particle.vy -= Math.sin(angle) * force * 0.5;
            
            // Brighten particles near mouse
            particle.opacity = Math.min(1, particle.opacity + force * 0.1);
          }
        }
        
        // 3D depth effect
        if (depth) {
          particle.vz += (Math.random() - 0.5) * 0.01;
          particle.vz *= 0.99;
          particle.z += particle.vz;
          
          // Keep z in bounds
          if (particle.z < -100) particle.z = -100;
          if (particle.z > 100) particle.z = 100;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        
        // Calculate perspective
        const perspectiveFactor = depth ? 1 + particle.z / 200 : 1;
        const projectedSize = particle.size * perspectiveFactor;
        const projectedOpacity = particle.opacity * (depth ? (1 + particle.z / 400) : 1);
        
        // Draw particle
        if (particle.type === 'spark') {
          // Draw sparks as lines
          ctx.strokeStyle = particle.color + Math.floor(projectedOpacity * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = projectedSize;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
          ctx.stroke();
        } else {
          // Draw glow
          const glowSize = projectedSize * 4;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize
          );
          
          gradient.addColorStop(0, particle.color + Math.floor(projectedOpacity * 128).toString(16).padStart(2, '0'));
          gradient.addColorStop(0.5, particle.color + Math.floor(projectedOpacity * 64).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, particle.color + '00');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw core
          ctx.fillStyle = particle.color + Math.floor(projectedOpacity * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, projectedSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Pulsing effect
        if (particle.type === 'orbiter' || particle.type === 'floater') {
          const pulseScale = 1 + Math.sin(timeRef.current * 2 + particle.pulsePhase!) * 0.2;
          
          ctx.fillStyle = particle.color + '20';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, projectedSize * 2 * pulseScale, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== 'ambient' && p1.type !== 'orbiter') continue;
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== 'ambient' && p2.type !== 'orbiter') continue;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = depth ? p1.z - p2.z : 0;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 80) {
            const opacity = (1 - distance / 80) * 0.2;
            ctx.globalAlpha = opacity * p1.opacity * p2.opacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
      
      // Aurora effect for aurora color scheme
      if (colorScheme === 'aurora') {
        ctx.save();
        
        for (let i = 0; i < 3; i++) {
          const offset = i * 100;
          const alpha = 0.03;
          
          const gradient = ctx.createLinearGradient(
            0, canvas.height / 2 + Math.sin(timeRef.current + i) * 50,
            canvas.width, canvas.height / 2 + Math.cos(timeRef.current + i) * 50
          );
          
          const colors = colorPalettes.aurora;
          colors.forEach((color, index) => {
            gradient.addColorStop(
              index / (colors.length - 1),
              color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
            );
          });
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, interactive, colorScheme, depth, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        opacity: 0.8,
        mixBlendMode: 'screen'
      }}
    />
  );
};