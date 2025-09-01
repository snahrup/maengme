import React, { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AlkaloidVisualizerProps {
  phase: 'pre-onset' | 'onset' | 'peak' | 'tail' | 'after';
  metabolismRate: number;
  alkaloids: {
    mitragynine?: number;
    speciociliatine?: number;
    paynantheine?: number;
    speciogynine?: number;
    hydroxymitragynine?: number;
  };
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  size: number;
  opacity: number;
  color: string;
}

export const AlkaloidVisualizer: React.FC<AlkaloidVisualizerProps> = ({
  phase,
  metabolismRate,
  alkaloids
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  // Define colors for each alkaloid type
  const alkaloidColors = {
    mitragynine: '#1DA1FF',
    speciociliatine: '#00D9FF',
    paynantheine: '#7B61FF',
    speciogynine: '#FF61DC',
    hydroxymitragynine: '#FFD700'
  };

  // Initialize particles based on alkaloid profile
  useEffect(() => {
    const particles: Particle[] = [];
    let id = 0;
    
    Object.entries(alkaloids).forEach(([type, percentage]) => {
      if (!percentage) return;
      
      const count = Math.floor((percentage || 0) * 2); // Scale particle count
      for (let i = 0; i < count; i++) {
        particles.push({
          id: id++,
          x: Math.random() * 400,
          y: Math.random() * 256,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          type,
          size: 2 + Math.random() * 3,
          opacity: 0.3 + Math.random() * 0.7,
          color: alkaloidColors[type as keyof typeof alkaloidColors] || '#FFFFFF'
        });
      }
    });
    
    particlesRef.current = particles;
  }, [alkaloids]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position based on phase
        let speedMultiplier = 1;
        let attractX = canvas.width / 2;
        let attractY = canvas.height / 2;
        
        switch (phase) {
          case 'pre-onset':
            speedMultiplier = 0.3;
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            break;
            
          case 'onset':
            speedMultiplier = 0.8;
            // Particles start converging
            particle.vx += (attractX - particle.x) * 0.0001;
            particle.vy += (attractY - particle.y) * 0.0001;
            break;
            
          case 'peak':
            speedMultiplier = 1.5;
            // Orbital motion around center
            const angle = Math.atan2(particle.y - attractY, particle.x - attractX);
            particle.vx = Math.cos(angle + Math.PI/2) * 2;
            particle.vy = Math.sin(angle + Math.PI/2) * 2;
            break;
            
          case 'tail':
            speedMultiplier = 0.5;
            // Particles slow and disperse
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.vx += (Math.random() - 0.5) * 0.05;
            particle.vy += (Math.random() - 0.5) * 0.05;
            break;
            
          case 'after':
            speedMultiplier = 0.2;
            // Particles fade and drift
            particle.opacity *= 0.995;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            break;
        }
        
        // Apply metabolism rate to speed
        speedMultiplier *= (0.5 + metabolismRate / 100);
        
        // Update position
        particle.x += particle.vx * speedMultiplier;
        particle.y += particle.vy * speedMultiplier;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Limit velocity
        const maxSpeed = 3;
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
        
        // Draw particle with glow effect
        const glowSize = particle.size * 3;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, particle.color + Math.floor(particle.opacity * 255).toString(16));
        gradient.addColorStop(0.5, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          if (distance < 50) {
            ctx.globalAlpha = (1 - distance / 50) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, metabolismRate]);

  // Phase labels and descriptions
  const phaseInfo = useMemo(() => {
    const info = {
      'pre-onset': {
        label: 'Absorption Phase',
        description: 'Alkaloids entering bloodstream'
      },
      'onset': {
        label: 'Binding Phase',
        description: 'Receptor engagement beginning'
      },
      'peak': {
        label: 'Saturation Phase',
        description: 'Maximum receptor activity'
      },
      'tail': {
        label: 'Metabolization Phase',
        description: 'Alkaloids being processed'
      },
      'after': {
        label: 'Clearance Phase',
        description: 'Minimal alkaloid activity'
      }
    };
    return info[phase];
  }, [phase]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={256}
        className="w-full h-full"
      />
      
      {/* Phase Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={phase}
        className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10"
      >
        <h3 className="text-white font-medium text-sm mb-1">{phaseInfo.label}</h3>
        <p className="text-white/60 text-xs">{phaseInfo.description}</p>
      </motion.div>
      
      {/* Metabolism Rate Indicator */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1DA1FF] animate-pulse" />
          <span className="text-white/60 text-xs">Metabolism</span>
          <span className="text-white text-xs font-medium">{Math.round(metabolismRate)}%</span>
        </div>
      </div>
      
      {/* Alkaloid Legend */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10">
        <div className="space-y-1">
          {Object.entries(alkaloids).map(([type, percentage]) => {
            if (!percentage) return null;
            return (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: alkaloidColors[type as keyof typeof alkaloidColors] }}
                />
                <span className="text-white/60 text-xs capitalize">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};