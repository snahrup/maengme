import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface SynapseNode {
  id: number;
  x: number;
  y: number;
  connections: number[];
  activity: number;
  pulsePhase: number;
}

interface Pulse {
  id: string;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  intensity: number;
}

interface NeuralSynapseNetworkProps {
  phase: 'waiting' | 'onset' | 'peak' | 'comedown';
  intensity: number;
  isActive: boolean;
}

export const NeuralSynapseNetwork: React.FC<NeuralSynapseNetworkProps> = ({
  phase,
  intensity,
  isActive
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const animationRef = useRef<number>();
  
  // Generate brain-like node topology
  const nodes = useMemo<SynapseNode[]>(() => {
    const nodeCount = 20;
    const nodes: SynapseNode[] = [];
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Create nodes in brain-like clusters
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radiusVariance = 0.3 + Math.random() * 0.7;
      const radius = 150 * radiusVariance;
      
      // Create clusters by grouping angles
      const clusterOffset = Math.floor(i / 5) * 30;
      const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * clusterOffset;
      const y = centerY + Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * clusterOffset;
      
      nodes.push({
        id: i,
        x,
        y,
        connections: [],
        activity: 0,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    // Create connections (synapses)
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      const possibleConnections = nodes
        .map((n, idx) => ({ idx, dist: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(n => n.idx !== i && n.dist < 200)
        .sort((a, b) => a.dist - b.dist);
      
      node.connections = possibleConnections
        .slice(0, connectionCount)
        .map(n => n.idx);
    });
    
    return nodes;
  }, [dimensions]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate pulses based on phase and intensity
  useEffect(() => {
    if (!isActive || phase === 'waiting') {
      setPulses([]);
      return;
    }
    
    const generatePulse = () => {
      const fromNode = Math.floor(Math.random() * nodes.length);
      const toNodes = nodes[fromNode].connections;
      if (toNodes.length === 0) return;
      
      const toNode = toNodes[Math.floor(Math.random() * toNodes.length)];
      
      const newPulse: Pulse = {
        id: `${Date.now()}-${Math.random()}`,
        fromNode,
        toNode,
        progress: 0,
        speed: 0.02 + intensity * 0.03,
        intensity: 0.5 + intensity * 0.5
      };
      
      setPulses(prev => [...prev, newPulse]);
    };
    
    // Pulse generation rate based on phase
    let interval: number;
    switch (phase) {
      case 'onset':
        interval = 800 - intensity * 400; // 800ms to 400ms
        break;
      case 'peak':
        interval = 100 + Math.random() * 200; // Rapid firing
        break;
      case 'comedown':
        interval = 1500 - intensity * 500; // Slow down
        break;
      default:
        interval = 2000;
    }
    
    const pulseInterval = setInterval(generatePulse, interval);
    
    return () => clearInterval(pulseInterval);
  }, [phase, intensity, isActive, nodes]);
  
  // Animation loop for pulses
  useEffect(() => {
    const animate = () => {
      setPulses(prev => {
        return prev
          .map(pulse => ({
            ...pulse,
            progress: pulse.progress + pulse.speed
          }))
          .filter(pulse => pulse.progress <= 1);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isActive && phase !== 'waiting') {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, phase]);
  
  // Calculate path between nodes
  const getPath = (from: SynapseNode, to: SynapseNode) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const mx = from.x + dx * 0.5;
    const my = from.y + dy * 0.5;
    
    // Add curve for organic look
    const curve = 20;
    const cx1 = mx - dy * 0.1;
    const cy1 = my + dx * 0.1;
    
    return `M ${from.x} ${from.y} Q ${cx1} ${cy1} ${to.x} ${to.y}`;
  };
  
  // Phase-based colors
  const getColor = () => {
    switch (phase) {
      case 'onset': return { node: '#FCD34D', pulse: '#FBBF24', glow: '#FEF3C7' };
      case 'peak': return { node: '#34D399', pulse: '#10B981', glow: '#A7F3D0' };
      case 'comedown': return { node: '#A78BFA', pulse: '#8B5CF6', glow: '#DDD6FE' };
      default: return { node: '#60A5FA', pulse: '#3B82F6', glow: '#DBEAFE' };
    }
  };
  
  const colors = getColor();
  const opacity = phase === 'waiting' ? 0 : 0.3 + intensity * 0.4;
  
  if (!isActive || phase === 'waiting') return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Render connections */}
        {nodes.map(node => 
          node.connections.map(targetIdx => {
            const target = nodes[targetIdx];
            if (!target) return null;
            
            return (
              <path
                key={`${node.id}-${targetIdx}`}
                d={getPath(node, target)}
                stroke={colors.node}
                strokeWidth="0.5"
                fill="none"
                opacity={opacity * 0.3}
              />
            );
          })
        )}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            {/* Node glow */}
            <circle
              cx={node.x}
              cy={node.y}
              r={8 + intensity * 4}
              fill={colors.glow}
              opacity={opacity * 0.2}
              filter="url(#glow)"
            />
            {/* Node core */}
            <circle
              cx={node.x}
              cy={node.y}
              r={3 + intensity * 2}
              fill={colors.node}
              opacity={opacity}
            />
          </g>
        ))}
        
        {/* Render pulses */}
        {pulses.map(pulse => {
          const from = nodes[pulse.fromNode];
          const to = nodes[pulse.toNode];
          if (!from || !to) return null;
          
          const x = from.x + (to.x - from.x) * pulse.progress;
          const y = from.y + (to.y - from.y) * pulse.progress;
          
          return (
            <g key={pulse.id}>
              {/* Pulse glow */}
              <circle
                cx={x}
                cy={y}
                r={6 + pulse.intensity * 4}
                fill={colors.pulse}
                opacity={pulse.intensity * 0.3}
                filter="url(#glow)"
              />
              {/* Pulse core */}
              <circle
                cx={x}
                cy={y}
                r={2 + pulse.intensity * 2}
                fill={colors.pulse}
                opacity={pulse.intensity * 0.8}
              />
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
};