import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Brain, 
  Activity, 
  Zap, 
  X,
  Info,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

interface EffectTrackerProps {
  onLog: (strength: number, notes?: string) => void;
  onClose: () => void;
  currentPhase: 'pre-onset' | 'onset' | 'peak' | 'tail' | 'after';
}

export const EffectTracker: React.FC<EffectTrackerProps> = ({ 
  onLog, 
  onClose,
  currentPhase 
}) => {
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

  const strengthLabels = [
    { value: 0, label: 'Nothing', icon: Meh },
    { value: 3, label: 'Mild', icon: Smile },
    { value: 5, label: 'Moderate', icon: Smile },
    { value: 7, label: 'Strong', icon: Smile },
    { value: 10, label: 'Intense', icon: Sparkles }
  ];

  const getStrengthLabel = () => {
    if (strength === 0) return 'Nothing Yet';
    if (strength <= 3) return 'Mild Effects';
    if (strength <= 5) return 'Moderate Effects';
    if (strength <= 7) return 'Strong Effects';
    return 'Intense Effects';
  };

  const getPhaseHint = () => {
    switch(currentPhase) {
      case 'pre-onset':
        return "It's normal to not feel much yet - effects typically begin soon";
      case 'onset':
        return "You might start feeling the first effects now";
      case 'peak':
        return "This is typically when effects are strongest";
      case 'tail':
        return "Effects usually start tapering during this phase";
      case 'after':
        return "Most effects should be minimal by now";
      default:
        return "";
    }
  };

  const handleSubmit = () => {
    // Combine selected effects into notes
    const effectNotes = selectedEffects.length > 0 
      ? `Effects: ${selectedEffects.join(', ')}. ${notes}`.trim()
      : notes;
    
    onLog(strength, effectNotes);
    
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">How are you feeling?</h2>
            <p className="text-sm text-white/60 mt-1">{getPhaseHint()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Strength Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white/80 text-sm font-medium">Effect Strength</label>
            <span className="text-[#1DA1FF] font-medium">{getStrengthLabel()}</span>
          </div>
          
          {/* Visual strength indicator */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-full transition-all cursor-pointer ${
                  i < strength 
                    ? 'bg-gradient-to-r from-[#1DA1FF] to-[#007AFF]' 
                    : 'bg-white/10'
                }`}
                onClick={() => setStrength(i + 1)}
              />
            ))}
          </div>
          
          <input
            type="range"
            min="0"
            max="10"
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #1DA1FF 0%, #007AFF ${strength * 10}%, rgba(255,255,255,0.1) ${strength * 10}%)`
            }}
          />
          
          {/* Quick presets */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setStrength(0)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                strength === 0 
                  ? 'bg-[#1DA1FF]/20 text-[#1DA1FF] border border-[#1DA1FF]/30' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Nothing
            </button>
            <button
              onClick={() => setStrength(3)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                strength === 3 
                  ? 'bg-[#1DA1FF]/20 text-[#1DA1FF] border border-[#1DA1FF]/30' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Mild
            </button>
            <button
              onClick={() => setStrength(5)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                strength === 5 
                  ? 'bg-[#1DA1FF]/20 text-[#1DA1FF] border border-[#1DA1FF]/30' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Moderate
            </button>
            <button
              onClick={() => setStrength(8)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                strength === 8 
                  ? 'bg-[#1DA1FF]/20 text-[#1DA1FF] border border-[#1DA1FF]/30' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Strong
            </button>
          </div>
        </div>

        {/* Effect Types */}
        <div className="mb-6">
          <label className="text-white/80 text-sm font-medium mb-3 block">
            What effects are you experiencing?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {effectOptions.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => toggleEffect(label)}
                className={`p-3 rounded-xl border transition-all flex items-center gap-2 ${
                  selectedEffects.includes(label)
                    ? 'bg-white/10 border-[#1DA1FF]/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-white/80 text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-white/80 text-sm font-medium mb-2 block">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other observations..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#1DA1FF]/50 transition-colors resize-none"
            rows={3}
          />
        </div>

        {/* Helper text */}
        <div className="flex items-start gap-2 mb-6 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <Info className="w-4 h-4 text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-300/80">
            Logging effects helps track your personal patterns and optimize future sessions
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 font-medium hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Log Effect
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};