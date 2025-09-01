import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  Zap, 
  Clock, 
  TrendingUp,
  ChevronLeft,
  Play,
  Save,
  Beaker
} from 'lucide-react';
import { Product, ProductPreset } from '../types/product';

interface ProductDetailsProps {
  product: Product;
  onStartSession: (preset: ProductPreset) => void;
  onBack: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onStartSession,
  onBack 
}) => {
  const [dose, setDose] = useState<number>(product.commonDoses?.light || 3);
  const [doseUnit, setDoseUnit] = useState<'g' | 'capsules'>('g');
  const [method, setMethod] = useState<'toss-wash' | 'tea' | 'capsule' | 'mixed'>('toss-wash');
  const [notes, setNotes] = useState('');
  
  const handleStartSession = () => {
    const preset: ProductPreset = {
      id: `preset-${Date.now()}`,      productId: product.id,
      product: product,
      dose: dose,
      doseUnit: doseUnit,
      method: method,
      notes: notes,
      lastUsed: new Date(),
      useCount: 1
    };
    
    onStartSession(preset);
  };
  
  const getDoseIntensity = () => {
    if (!product.commonDoses) return 'Unknown';
    if (dose <= product.commonDoses.threshold) return 'Threshold';
    if (dose <= product.commonDoses.light) return 'Light';
    if (dose <= product.commonDoses.moderate) return 'Moderate';
    if (dose <= product.commonDoses.strong) return 'Strong';
    return 'Very Strong';
  };
  
  const getDoseColor = () => {
    const intensity = getDoseIntensity();
    switch(intensity) {
      case 'Threshold': return 'text-blue-400';
      case 'Light': return 'text-green-400';
      case 'Moderate': return 'text-yellow-400';
      case 'Strong': return 'text-orange-400';
      case 'Very Strong': return 'text-red-400';
      default: return 'text-white/60';
    }
  };  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a4f3c 0%, #083028 50%, #041a15 100%)'
      }}
    >
      {/* Header */}
      <div className="glass-panel border-b border-white/10">
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <button className="glass-button-secondary">
            <Save className="w-4 h-4" />
            <span>Save Preset</span>
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Product Header */}
        <motion.div 
          className="glass-panel p-6 mb-6"          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-6">
            {/* Product Image */}
            <div className="w-32 h-32 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-light text-white mb-2">{product.name}</h1>
              <p className="text-white/60 text-lg mb-4">{product.manufacturer}</p>
              
              <div className="flex gap-3">
                <span className={`px-3 py-1 rounded-full text-sm bg-${product.vein}-500/20 border border-${product.vein}-500/30`}>
                  {product.vein} Vein
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 border border-white/20">                  {product.strain}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 border border-white/20">
                  {product.ingestion}
                </span>
              </div>
              
              {product.description && (
                <p className="mt-4 text-white/70">{product.description}</p>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Dose Configuration */}
        <motion.div 
          className="glass-panel p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-light text-white mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-green-400" />
            Dose Configuration
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dose Amount */}
            <div>
              <label className="text-white/60 text-sm block mb-2">Amount</label>              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={dose}
                  onChange={(e) => setDose(parseFloat(e.target.value))}
                  className="flex-1 accent-green-400"
                />
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl font-light text-white">{dose}</div>
                  <div className={`text-sm ${getDoseColor()}`}>{getDoseIntensity()}</div>
                </div>
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value as 'g' | 'capsules')}
                  className="glass-input w-24"
                >
                  <option value="g">grams</option>
                  <option value="capsules">caps</option>
                </select>
              </div>
            </div>
            
            {/* Method */}
            <div>
              <label className="text-white/60 text-sm block mb-2">Method</label>
              <div className="grid grid-cols-2 gap-2">
                {(['toss-wash', 'tea', 'capsule', 'mixed'] as const).map(m => (                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${
                      method === m 
                        ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    } border`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mt-4">
            <label className="text-white/60 text-sm block mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Empty stomach, with food, etc..."
              className="glass-input w-full h-20 resize-none"
            />
          </div>
        </motion.div>
        
        {/* Alkaloid Profile & Timing */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Alkaloid Profile */}          <motion.div 
            className="glass-panel p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Alkaloid Profile
            </h3>
            
            {product.mitragynine && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Mitragynine</span>
                  <span className="text-green-400">{product.mitragynine}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(product.mitragynine / 2) * 100}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </div>
              </div>
            )}
            
            {product.hydroxymitragynine && (
              <div>
                <div className="flex justify-between text-sm mb-1">                  <span className="text-white/60">7-Hydroxymitragynine</span>
                  <span className="text-purple-400">{product.hydroxymitragynine}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(product.hydroxymitragynine / 0.1) * 100}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Timing Expectations */}
          <motion.div 
            className="glass-panel p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              Expected Timeline
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Onset</span>
                <span className="text-green-400">{product.expectedOnset || '10-15'} min</span>              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Peak</span>
                <span className="text-yellow-400">{product.expectedPeak || '30-45'} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Duration</span>
                <span className="text-orange-400">{product.expectedDuration || '90-120'} min</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Effects & Warnings */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Expected Effects */}
          {product.effects && (
            <motion.div 
              className="glass-panel p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Expected Effects
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.effects.map(effect => (
                  <span key={effect} className="px-3 py-1 rounded-full text-sm bg-green-500/10 border border-green-500/20 text-green-300">
                    {effect}                  </span>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Warnings */}
          {product.warnings && (
            <motion.div 
              className="glass-panel p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Warnings
              </h3>
              <ul className="space-y-2">
                {product.warnings.map(warning => (
                  <li key={warning} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        
        {/* Start Session Button */}
        <motion.div           initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={handleStartSession}
            className="glass-button-primary px-12 py-4 text-lg group"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Start Session</span>
          </button>
        </motion.div>
        
        {/* Legal Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-white/40 text-xs"
        >
          Informational only. Not medical advice. Always consult healthcare providers.
        </motion.div>
      </div>
    </motion.div>
  );
};