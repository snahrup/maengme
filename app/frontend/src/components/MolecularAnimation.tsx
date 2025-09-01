import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MolecularAnimationProps {
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

interface Molecule {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  type: string;
  size: number;
  opacity: number;
  color: string;
  bonds: number[];
  charge: number;
  mass: number;
  rotation: number;
  rotationSpeed: number;
  glowIntensity: number;
}

export const MolecularAnimation: React.FC<MolecularAnimationProps> = ({
  phase,
  metabolismRate,
  alkaloids
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moleculesRef = useRef<Molecule[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  // Enhanced color palette with gradients
  const alkaloidColors = {
    mitragynine: { primary: '#1DA1FF', secondary: '#0080FF', glow: '#4DB8FF' },
    speciociliatine: { primary: '#00D9FF', secondary: '#00B3E6', glow: '#66E5FF' },
    paynantheine: { primary: '#7B61FF', secondary: '#6B51E5', glow: '#9B81FF' },
    speciogynine: { primary: '#FF61DC', secondary: '#E551C2', glow: '#FF91EC' },
    hydroxymitragynine: { primary: '#FFD700', secondary: '#E6C200', glow: '#FFE74D' }
  };

  // Initialize molecules with enhanced properties
  useEffect(() => {
    const molecules: Molecule[] = [];
    let id = 0;
    
    Object.entries(alkaloids).forEach(([type, percentage]) => {
      if (!percentage) return;
      
      const count = Math.floor((percentage || 0) * 3); // More molecules for better effect
      const colorSet = alkaloidColors[type as keyof typeof alkaloidColors];
      
      for (let i = 0; i < count; i++) {
        molecules.push({
          id: id++,
          x: Math.random() * 400,
          y: Math.random() * 256,
          z: Math.random() * 100 - 50,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 1,
          type,
          size: 3 + Math.random() * 4,
          opacity: 0.5 + Math.random() * 0.5,
          color: colorSet?.primary || '#FFFFFF',
          bonds: [],
          charge: Math.random() * 2 - 1,
          mass: 1 + Math.random() * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          glowIntensity: 0.5 + Math.random() * 0.5
        });
      }
    });
    
    // Create initial bonds between nearby molecules
    for (let i = 0; i < molecules.length; i++) {
      for (let j = i + 1; j < molecules.length; j++) {
        const dx = molecules[i].x - molecules[j].x;
        const dy = molecules[i].y - molecules[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 60 && molecules[i].bonds.length < 3 && molecules[j].bonds.length < 3) {
          molecules[i].bonds.push(j);
          molecules[j].bonds.push(i);
        }
      }
    }
    
    moleculesRef.current = molecules;
  }, [alkaloids]);

  // Track mouse position for interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(11, 18, 32, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const molecules = moleculesRef.current;
      
      // Update molecules based on phase
      molecules.forEach((molecule, index) => {
        // Phase-specific behavior
        let attractX = canvas.width / 2;
        let attractY = canvas.height / 2;
        let speedMultiplier = 1;
        let bondStrength = 0.01;
        
        switch (phase) {
          case 'pre-onset':
            // Random floating motion
            speedMultiplier = 0.3;
            molecule.vx += (Math.random() - 0.5) * 0.2;
            molecule.vy += (Math.random() - 0.5) * 0.2;
            molecule.vz += (Math.random() - 0.5) * 0.1;
            molecule.glowIntensity = 0.3 + Math.sin(timeRef.current * 2 + molecule.id) * 0.2;
            break;
            
          case 'onset':
            // Molecules start converging and forming structures
            speedMultiplier = 0.8;
            bondStrength = 0.02;
            
            // Attraction to center
            molecule.vx += (attractX - molecule.x) * 0.0003;
            molecule.vy += (attractY - molecule.y) * 0.0003;
            
            // Pulsing glow
            molecule.glowIntensity = 0.5 + Math.sin(timeRef.current * 3 + molecule.id) * 0.3;
            break;
            
          case 'peak':
            // Complex orbital patterns and molecular structures
            speedMultiplier = 1.5;
            bondStrength = 0.05;
            
            // Create spiral/orbital motion
            const angle = Math.atan2(molecule.y - attractY, molecule.x - attractX);
            const radius = Math.sqrt((molecule.x - attractX) ** 2 + (molecule.y - attractY) ** 2);
            
            // Orbital velocity with charge influence
            const orbitalSpeed = 2 + molecule.charge;
            molecule.vx = Math.cos(angle + Math.PI/2) * orbitalSpeed + Math.cos(timeRef.current * 2) * 0.5;
            molecule.vy = Math.sin(angle + Math.PI/2) * orbitalSpeed + Math.sin(timeRef.current * 2) * 0.5;
            
            // 3D rotation effect
            molecule.z = Math.sin(timeRef.current + molecule.id * 0.5) * 30;
            
            // Intense glow
            molecule.glowIntensity = 0.8 + Math.sin(timeRef.current * 5 + molecule.id) * 0.2;
            
            // Form complex structures
            if (radius > 80) {
              molecule.vx -= (molecule.x - attractX) * 0.001;
              molecule.vy -= (molecule.y - attractY) * 0.001;
            }
            break;
            
          case 'tail':
            // Molecules slow down and bonds weaken
            speedMultiplier = 0.5;
            bondStrength = 0.005;
            
            molecule.vx *= 0.97;
            molecule.vy *= 0.97;
            molecule.vz *= 0.98;
            molecule.vx += (Math.random() - 0.5) * 0.1;
            molecule.vy += (Math.random() - 0.5) * 0.1;
            
            // Fading glow
            molecule.glowIntensity *= 0.98;
            break;
            
          case 'after':
            // Dispersion and fading
            speedMultiplier = 0.2;
            bondStrength = 0;
            
            molecule.opacity *= 0.995;
            molecule.vx *= 0.95;
            molecule.vy *= 0.95;
            molecule.glowIntensity *= 0.95;
            
            // Drift away from center
            molecule.vx += (molecule.x - attractX) * 0.0001;
            molecule.vy += (molecule.y - attractY) * 0.0001;
            break;
        }
        
        // Apply metabolism rate
        speedMultiplier *= (0.5 + metabolismRate / 100);
        
        // Mouse interaction - molecules react to cursor
        const mouseDistance = Math.sqrt((molecule.x - mouseRef.current.x) ** 2 + (molecule.y - mouseRef.current.y) ** 2);
        if (mouseDistance < 50) {
          const mouseAngle = Math.atan2(molecule.y - mouseRef.current.y, molecule.x - mouseRef.current.x);
          molecule.vx += Math.cos(mouseAngle) * 0.5;
          molecule.vy += Math.sin(mouseAngle) * 0.5;
          molecule.glowIntensity = Math.min(1, molecule.glowIntensity + 0.1);
        }
        
        // Apply bond forces
        molecule.bonds.forEach(bondedId => {
          const bonded = molecules[bondedId];
          if (!bonded) return;
          
          const dx = bonded.x - molecule.x;
          const dy = bonded.y - molecule.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const idealDistance = 40;
          const force = (distance - idealDistance) * bondStrength;
          
          molecule.vx += (dx / distance) * force / molecule.mass;
          molecule.vy += (dy / distance) * force / molecule.mass;
        });
        
        // Update position
        molecule.x += molecule.vx * speedMultiplier;
        molecule.y += molecule.vy * speedMultiplier;
        molecule.rotation += molecule.rotationSpeed;
        
        // Boundary wrapping
        if (molecule.x < 0) molecule.x = canvas.width;
        if (molecule.x > canvas.width) molecule.x = 0;
        if (molecule.y < 0) molecule.y = canvas.height;
        if (molecule.y > canvas.height) molecule.y = 0;
        
        // Limit velocity
        const maxSpeed = 4;
        const speed = Math.sqrt(molecule.vx ** 2 + molecule.vy ** 2);
        if (speed > maxSpeed) {
          molecule.vx = (molecule.vx / speed) * maxSpeed;
          molecule.vy = (molecule.vy / speed) * maxSpeed;
        }
      });
      
      // Dynamic bond management
      if (phase === 'onset' || phase === 'peak') {
        // Form new bonds
        for (let i = 0; i < molecules.length; i++) {
          for (let j = i + 1; j < molecules.length; j++) {
            if (molecules[i].bonds.includes(j)) continue;
            
            const dx = molecules[i].x - molecules[j].x;
            const dy = molecules[i].y - molecules[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50 && molecules[i].bonds.length < 4 && molecules[j].bonds.length < 4 && Math.random() > 0.98) {
              molecules[i].bonds.push(j);
              molecules[j].bonds.push(i);
            }
          }
        }
      } else if (phase === 'tail' || phase === 'after') {
        // Break bonds
        molecules.forEach(molecule => {
          if (Math.random() > 0.99 && molecule.bonds.length > 0) {
            const bondToBreak = Math.floor(Math.random() * molecule.bonds.length);
            const bondedId = molecule.bonds[bondToBreak];
            molecule.bonds.splice(bondToBreak, 1);
            
            const bonded = molecules[bondedId];
            if (bonded) {
              const index = bonded.bonds.indexOf(molecules.indexOf(molecule));
              if (index > -1) bonded.bonds.splice(index, 1);
            }
          }
        });
      }
      
      // Draw bonds with energy flow
      ctx.lineCap = 'round';
      molecules.forEach((molecule, index) => {
        molecule.bonds.forEach(bondedId => {
          const bonded = molecules[bondedId];
          if (!bonded || bondedId < index) return; // Avoid drawing twice
          
          const dx = bonded.x - molecule.x;
          const dy = bonded.y - molecule.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 100) return; // Don't draw very long bonds
          
          // Energy flow along bonds
          const gradient = ctx.createLinearGradient(molecule.x, molecule.y, bonded.x, bonded.y);
          const flowPosition = (Math.sin(timeRef.current * 3) + 1) / 2;
          
          const color1 = alkaloidColors[molecule.type as keyof typeof alkaloidColors];
          const color2 = alkaloidColors[bonded.type as keyof typeof alkaloidColors];
          
          gradient.addColorStop(0, color1?.primary + '20' || '#FFFFFF20');
          gradient.addColorStop(flowPosition, color1?.glow + '60' || '#FFFFFF60');
          gradient.addColorStop(1, color2?.primary + '20' || '#FFFFFF20');
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 + Math.sin(timeRef.current * 2) * 0.5;
          ctx.globalAlpha = 0.3 * molecule.opacity * bonded.opacity;
          
          ctx.beginPath();
          ctx.moveTo(molecule.x, molecule.y);
          ctx.lineTo(bonded.x, bonded.y);
          ctx.stroke();
        });
      });
      
      ctx.globalAlpha = 1;
      
      // Draw molecules with enhanced effects
      molecules.forEach(molecule => {
        const colorSet = alkaloidColors[molecule.type as keyof typeof alkaloidColors];
        if (!colorSet) return;
        
        // Calculate 3D projection
        const perspectiveFactor = 1 + molecule.z / 200;
        const projectedSize = molecule.size * perspectiveFactor;
        const projectedX = molecule.x;
        const projectedY = molecule.y;
        
        // Multi-layer glow effect
        const glowLayers = 3;
        for (let i = glowLayers; i > 0; i--) {
          const layerSize = projectedSize * (2 + i * 1.5) * molecule.glowIntensity;
          const gradient = ctx.createRadialGradient(
            projectedX, projectedY, 0,
            projectedX, projectedY, layerSize
          );
          
          const alpha = (molecule.opacity * molecule.glowIntensity * 0.15 / i).toFixed(2);
          gradient.addColorStop(0, colorSet.glow + alpha);
          gradient.addColorStop(0.4, colorSet.primary + Math.floor(parseFloat(alpha) * 0.5 * 255).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, colorSet.secondary + '00');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core molecule with rotation
        ctx.save();
        ctx.translate(projectedX, projectedY);
        ctx.rotate(molecule.rotation);
        
        // Inner bright core
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, projectedSize);
        coreGradient.addColorStop(0, '#FFFFFF' + Math.floor(molecule.opacity * 255).toString(16).padStart(2, '0'));
        coreGradient.addColorStop(0.5, colorSet.glow + Math.floor(molecule.opacity * 255).toString(16).padStart(2, '0'));
        coreGradient.addColorStop(1, colorSet.primary + Math.floor(molecule.opacity * 200).toString(16).padStart(2, '0'));
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, projectedSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add structure details for larger molecules
        if (projectedSize > 4) {
          ctx.strokeStyle = colorSet.glow + '80';
          ctx.lineWidth = 1;
          
          // Draw molecular structure pattern
          for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * projectedSize * 0.7, Math.sin(angle) * projectedSize * 0.7);
            ctx.stroke();
          }
        }
        
        ctx.restore();
        
        // Charge indicator
        if (Math.abs(molecule.charge) > 0.5) {
          ctx.fillStyle = molecule.charge > 0 ? '#FF6B6B40' : '#4DABF740';
          ctx.beginPath();
          ctx.arc(projectedX + projectedSize, projectedY - projectedSize, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw field effects during peak phase
      if (phase === 'peak') {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#1DA1FF';
        ctx.lineWidth = 0.5;
        
        // Draw field lines
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const startAngle = (Math.PI * 2 / 5) * i + timeRef.current * 0.5;
          const startX = canvas.width / 2 + Math.cos(startAngle) * 50;
          const startY = canvas.height / 2 + Math.sin(startAngle) * 50;
          
          ctx.moveTo(startX, startY);
          
          for (let j = 0; j < 20; j++) {
            const t = j / 20;
            const radius = 50 + t * 150;
            const angle = startAngle + t * Math.PI;
            const x = canvas.width / 2 + Math.cos(angle) * radius;
            const y = canvas.height / 2 + Math.sin(angle) * radius;
            ctx.lineTo(x, y);
          }
          
          ctx.stroke();
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
  }, [phase, metabolismRate]);

  // Phase information
  const phaseInfo = useMemo(() => {
    const info = {
      'pre-onset': {
        label: 'Molecular Dispersion',
        description: 'Alkaloids entering system'
      },
      'onset': {
        label: 'Molecular Binding',
        description: 'Receptor engagement beginning'
      },
      'peak': {
        label: 'Molecular Saturation',
        description: 'Maximum receptor activity'
      },
      'tail': {
        label: 'Molecular Breakdown',
        description: 'Alkaloids metabolizing'
      },
      'after': {
        label: 'Molecular Clearance',
        description: 'System returning to baseline'
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
        style={{ background: 'transparent' }}
      />
      
      {/* Phase Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={phase}
        className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-2xl rounded-xl p-3 border border-white/10"
      >
        <h3 className="text-white font-medium text-sm mb-1">{phaseInfo.label}</h3>
        <p className="text-white/60 text-xs">{phaseInfo.description}</p>
      </motion.div>
      
      {/* Metabolism Indicator */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-2xl rounded-xl p-3 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#1DA1FF]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#1DA1FF] animate-ping" />
          </div>
          <span className="text-white/60 text-xs">Activity</span>
          <span className="text-white text-xs font-medium">{Math.round(metabolismRate)}%</span>
        </div>
      </div>
      
      {/* Alkaloid Legend */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-2xl rounded-xl p-3 border border-white/10">
        <h4 className="text-white/80 text-xs font-medium mb-2">Active Alkaloids</h4>
        <div className="space-y-1.5">
          {Object.entries(alkaloids).map(([type, percentage]) => {
            if (!percentage) return null;
            const colors = alkaloidColors[type as keyof typeof alkaloidColors];
            return (
              <div key={type} className="flex items-center gap-2">
                <div className="relative">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors?.primary }}
                  />
                  <div 
                    className="absolute inset-0 w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: colors?.glow, opacity: 0.5 }}
                  />
                </div>
                <span className="text-white/60 text-xs capitalize">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-white/40 text-xs ml-auto">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};