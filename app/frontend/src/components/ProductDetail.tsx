import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailProps {
  product: any;
  onClose: () => void;
  onSelect: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onClose, 
  onSelect 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'effects' | 'interactions'>('overview');
  
  // Mock data for demonstration
  const effects = [
    { name: 'Energy', level: 75, color: 'from-yellow-400 to-orange-400' },
    { name: 'Focus', level: 85, color: 'from-blue-400 to-purple-400' },
    { name: 'Mood', level: 60, color: 'from-green-400 to-teal-400' },
    { name: 'Pain Relief', level: 40, color: 'from-red-400 to-pink-400' }
  ];
  
  const typicalTimes = {
    onset: '10-15 min',
    peak: '45-60 min',
    duration: '3-4 hours'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg-start/95 backdrop-blur-lg z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-glass-tint/60 backdrop-blur-panel rounded-glass-xl max-w-md w-full max-h-[80vh] overflow-hidden border border-glass-stroke/30"
      >        {/* Header */}
        <div className="p-6 border-b border-glass-stroke/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-light text-text-primary">
                {product.manufacturer}
              </h2>
              <p className="text-text-secondary/60">
                {product.strain || product.ingestion}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary/40 hover:text-text-primary transition-colors text-xl"
            >
              ×
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2">
            {(['overview', 'effects', 'interactions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-text-secondary/60'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >                <div className="bg-glass-tint/40 rounded-glass p-4">
                  <h3 className="text-text-secondary text-sm mb-3">Typical Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary/60">Onset</span>
                      <span className="text-text-primary">{typicalTimes.onset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary/60">Peak</span>
                      <span className="text-text-primary">{typicalTimes.peak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary/60">Duration</span>
                      <span className="text-text-primary">{typicalTimes.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-glass-tint/40 rounded-glass p-4">
                  <h3 className="text-text-secondary text-sm mb-2">Description</h3>
                  <p className="text-text-secondary/80 text-sm">
                    Premium quality {product.manufacturer} product. Known for consistent effects and reliable timing.
                  </p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'effects' && (
              <motion.div
                key="effects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {effects.map((effect, index) => (
                  <div key={effect.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary/80 text-sm">{effect.name}</span>
                      <span className="text-text-secondary/60 text-xs">{effect.level}%</span>
                    </div>
                    <div className="h-2 bg-glass-tint/40 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${effect.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${effect.level}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            
            {activeTab === 'interactions' && (
              <motion.div
                key="interactions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-glass p-3">
                  <p className="text-amber-200 text-sm">
                    ⚠️ Always consult with a healthcare provider before use
                  </p>
                </div>
                <div className="text-text-secondary/80 text-sm space-y-2">
                  <p>• May interact with medications</p>
                  <p>• Not recommended with alcohol</p>
                  <p>• Start with lower doses</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-glass-stroke/20">
          <button
            onClick={onSelect}
            className="w-full py-3 bg-accent-primary rounded-glass text-text-primary font-medium shadow-glass"
          >
            Use This Product
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};