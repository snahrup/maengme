import React from 'react';
import { motion } from 'framer-motion';
import { TestTube2, X } from 'lucide-react';

interface DebugPanelProps {
  currentView: string;
  activePreset: any;
  selectedProduct: any;
  elapsed: number;
  state: string;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  currentView,
  activePreset,
  selectedProduct,
  elapsed,
  state
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-[100] p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
      >
        <TestTube2 className="w-4 h-4 text-purple-400" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-[100] w-80 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-purple-500/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-purple-400 font-medium">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>
      
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-white/40">View:</span>
          <span className="text-green-400">{currentView}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Timer State:</span>
          <span className="text-yellow-400">{state}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Elapsed:</span>
          <span className="text-blue-400">{Math.floor(elapsed / 1000)}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Has Preset:</span>
          <span className={activePreset ? 'text-green-400' : 'text-red-400'}>
            {activePreset ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Has Product:</span>
          <span className={selectedProduct ? 'text-green-400' : 'text-red-400'}>
            {selectedProduct ? 'Yes' : 'No'}
          </span>
        </div>
        {activePreset && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="text-white/40 mb-1">Preset:</div>
            <div className="text-white/60">{activePreset.product?.name || 'Unknown'}</div>
            <div className="text-white/60">{activePreset.dose}{activePreset.doseUnit}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};