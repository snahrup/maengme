import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  animate?: boolean;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 128, 
  animate = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!animate || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let rotation = 0;
    
    const drawGlow = () => {
      ctx.clearRect(0, 0, size * 2, size * 2);
      
      // Create gradient glow
      const gradient = ctx.createRadialGradient(size, size, 0, size, size, size);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(29, 161, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(29, 161, 255, 0)');
      
      // Draw rotating glow
      ctx.save();
      ctx.translate(size, size);
      ctx.rotate(rotation);
      
      // Draw glow rays
      for (let i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 4);
        ctx.fillStyle = gradient;
        ctx.fillRect(-2, -size, 4, size * 2);
        ctx.restore();
      }
      
      ctx.restore();
      
      rotation += 0.01;
      animationId = requestAnimationFrame(drawGlow);
    };
    
    drawGlow();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animate, size]);
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className="absolute inset-0 pointer-events-none"
        style={{
          width: size,
          height: size,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      <motion.img
        src="/icon-192.png"
        alt="MaengMe"
        className="relative z-10"
        style={{ width: size, height: size }}
        animate={animate ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};