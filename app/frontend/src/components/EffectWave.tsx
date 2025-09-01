import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EffectWaveProps {
  effectHistory: Array<{ time: number; strength: number }>;
  currentTime: number;
  expectedPeak: number;
  expectedDuration: number;
}

export const EffectWave: React.FC<EffectWaveProps> = ({
  effectHistory,
  currentTime,
  expectedPeak,
  expectedDuration
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw expected curve (ghost)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      const points = 100;
      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const minutes = t * expectedDuration;
        const x = (t * canvas.width);
        
        // Bell curve formula
        const peakMinutes = expectedPeak;
        const sigma = expectedDuration / 4;
        const intensity = Math.exp(-Math.pow(minutes - peakMinutes, 2) / (2 * Math.pow(sigma, 2)));
        const y = canvas.height - (intensity * canvas.height * 0.8) - 20;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw actual effect history
      if (effectHistory.length > 0) {
        // Create gradient for the wave
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(29, 161, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 122, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(29, 161, 255, 0)');
        
        // Draw filled area
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Start from bottom left
        ctx.moveTo(0, canvas.height);
        
        // Add smoothed points
        effectHistory.forEach((point, index) => {
          const x = (point.time / (expectedDuration * 60000)) * canvas.width;
          const y = canvas.height - (point.strength / 10 * canvas.height * 0.8) - 20;
          
          if (index === 0) {
            ctx.lineTo(x, y);
          } else {
            // Use bezier curves for smoothing
            const prevPoint = effectHistory[index - 1];
            const prevX = (prevPoint.time / (expectedDuration * 60000)) * canvas.width;
            const prevY = canvas.height - (prevPoint.strength / 10 * canvas.height * 0.8) - 20;
            
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
          }
        });
        
        // Close the path
        const lastPoint = effectHistory[effectHistory.length - 1];
        const lastX = (lastPoint.time / (expectedDuration * 60000)) * canvas.width;
        ctx.lineTo(lastX, canvas.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw the line on top
        ctx.strokeStyle = 'rgba(29, 161, 255, 1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        effectHistory.forEach((point, index) => {
          const x = (point.time / (expectedDuration * 60000)) * canvas.width;
          const y = canvas.height - (point.strength / 10 * canvas.height * 0.8) - 20;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevPoint = effectHistory[index - 1];
            const prevX = (prevPoint.time / (expectedDuration * 60000)) * canvas.width;
            const prevY = canvas.height - (prevPoint.strength / 10 * canvas.height * 0.8) - 20;
            
            const cpX = (prevX + x) / 2;
            ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
          }
        });
        ctx.stroke();
        
        // Draw points
        effectHistory.forEach(point => {
          const x = (point.time / (expectedDuration * 60000)) * canvas.width;
          const y = canvas.height - (point.strength / 10 * canvas.height * 0.8) - 20;
          
          // Outer glow
          ctx.fillStyle = 'rgba(29, 161, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner point
          ctx.fillStyle = '#1DA1FF';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      // Draw current time indicator
      const currentX = (currentTime / (expectedDuration * 60000)) * canvas.width;
      
      // Vertical line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Pulsing dot at current position
      const pulseScale = 1 + Math.sin(Date.now() / 500) * 0.3;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(currentX, 20, 4 * pulseScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      
      // Time labels
      const timeLabels = [0, expectedPeak, expectedDuration];
      timeLabels.forEach(minutes => {
        const x = (minutes / expectedDuration) * canvas.width;
        ctx.fillText(`${minutes}m`, x, canvas.height - 5);
      });
      
      // Intensity labels on left
      ctx.textAlign = 'right';
      for (let i = 0; i <= 10; i += 5) {
        const y = canvas.height - (i / 10 * canvas.height * 0.8) - 20;
        ctx.fillText(i.toString(), 15, y + 3);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectHistory, currentTime, expectedPeak, expectedDuration]);
  
  // Calculate session signature
  const getSessionSignature = () => {
    if (effectHistory.length < 2) return 'Building pattern...';
    
    const maxStrength = Math.max(...effectHistory.map(e => e.strength));
    const avgStrength = effectHistory.reduce((sum, e) => sum + e.strength, 0) / effectHistory.length;
    
    if (maxStrength >= 8) return 'Strong experience';
    if (maxStrength >= 6) return 'Moderate experience';
    if (maxStrength >= 4) return 'Mild experience';
    return 'Threshold experience';
  };
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={256}
        className="w-full h-full"
      />
      
      {/* Wave Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10"
      >
        <h3 className="text-white font-medium text-sm mb-1">Effect Wave</h3>
        <p className="text-white/60 text-xs">{getSessionSignature()}</p>
        {effectHistory.length > 0 && (
          <p className="text-[#1DA1FF] text-xs mt-1">
            {effectHistory.length} data points
          </p>
        )}
      </motion.div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-white/20" style={{ borderStyle: 'dashed', borderWidth: '1px 0 0 0', borderColor: 'rgba(255,255,255,0.2)' }} />
            <span className="text-white/40 text-xs">Expected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#1DA1FF]" />
            <span className="text-white/40 text-xs">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
            <span className="text-white/40 text-xs">Now</span>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      {effectHistory.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-xl rounded-xl p-3 border border-white/10">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-white/40">Peak</span>
              <div className="text-white font-medium">
                {Math.max(...effectHistory.map(e => e.strength))}/10
              </div>
            </div>
            <div>
              <span className="text-white/40">Avg</span>
              <div className="text-white font-medium">
                {(effectHistory.reduce((sum, e) => sum + e.strength, 0) / effectHistory.length).toFixed(1)}/10
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};