import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, Activity, Zap, X } from 'lucide-react';
import { sessionAnalytics } from '../services/sessionAnalytics';

interface EffectTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export const EffectTracker: React.FC<EffectTrackerProps> = ({ isOpen, onClose, productId }) => {
  const [strength, setStrength] = useState(5);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const effectOptions = [
    { icon: Sparkles, label: 'Euphoria', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Energy', color: 'text-green-400' },
    { icon: Brain, label: 'Focus', color: 'text-blue-400' },
    { icon: Activity, label: 'Relaxation', color: 'text-purple-400' },
    { icon: Zap, label: 'Pain Relief', color: 'text-red-400' }
  ];

  const handleSubmit = () => {
    sessionAnalytics.logEffect(strength, selectedEffects, notes);
    
    // Reset form
    setStrength(5);
    setSelectedEffects([]);
    setNotes('');
    onClose();
  };
  const toggleEffect = (effect: string) => {
    setSelectedEffects(prev =>
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-white">Log Effects</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Strength Slider */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">
                Effect Strength: {strength}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={strength}
                onChange={e => setStrength(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0.5) ${strength * 10}%, rgba(255, 255, 255, 0.1) ${strength * 10}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>Threshold</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Effect Selection */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-3">Select Effects</label>
              <div className="grid grid-cols-2 gap-2">
                {effectOptions.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => toggleEffect(label)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl transition-all
                      ${selectedEffects.includes(label)
                        ? 'bg-white/10 border-white/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } border
                    `}
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm text-white/80">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional observations..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={selectedEffects.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log Effects
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
