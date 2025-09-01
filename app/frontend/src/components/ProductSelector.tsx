import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Sparkles, Package } from 'lucide-react';
import { Product } from '../types/product';
import { products } from '../data/productsDatabase';

interface ProductSelectorProps {
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  onSelectProduct, 
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVein, setSelectedVein] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  
  const veins = ['all', 'red', 'green', 'white', 'yellow', 'mixed'];
  const methods = ['all', 'powder', 'capsule', 'extract', 'tea', 'tincture'];
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.strain.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVein = selectedVein === 'all' || product.vein === selectedVein;      const matchesMethod = selectedMethod === 'all' || product.ingestion === selectedMethod;
      
      return matchesSearch && matchesVein && matchesMethod;
    });
  }, [searchQuery, selectedVein, selectedMethod]);
  
  const getVeinColor = (vein: string) => {
    switch(vein) {
      case 'red': return 'bg-red-500/20 border-red-500/30';
      case 'green': return 'bg-green-500/20 border-green-500/30';
      case 'white': return 'bg-white/20 border-white/30';
      case 'yellow': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'mixed': return 'bg-purple-500/20 border-purple-500/30';
      default: return 'bg-white/10 border-white/20';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
        backdropFilter: 'blur(20px)'
      }}
      onClick={onClose}
    >
      <motion.div        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-panel">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-light text-white">Select Product</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by name, brand, or strain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl                  text-white placeholder-white/40 focus:outline-none focus:border-green-400/50"
              />
            </div>
            
            {/* Filters */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <div className="flex gap-2">
                {veins.map(vein => (
                  <button
                    key={vein}
                    onClick={() => setSelectedVein(vein)}
                    className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider transition-all
                      ${selectedVein === vein 
                        ? 'bg-green-500/30 border-green-500/50 text-green-300' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'} 
                      border`}
                  >
                    {vein}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product List */}
          <div className="overflow-y-auto max-h-[50vh] p-4">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <motion.div 
                  className="text-center py-12 text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}                >
                  No products found matching your criteria
                </motion.div>
              ) : (
                <div className="grid gap-3">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onSelectProduct(product)}
                      className="glass-card p-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-white/20" />
                            </div>
                          )}
                        </div>                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-medium">{product.name}</h3>
                              <p className="text-white/60 text-sm">{product.manufacturer}</p>
                              <div className="flex gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getVeinColor(product.vein)} border`}>
                                  {product.vein || 'Unknown'} Vein
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 border border-white/20">
                                  {product.ingestion}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-green-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-xs">
                        <span className="text-white/40">
                          Onset: <span className="text-green-400">{product.expectedOnset || '?'}min</span>
                        </span>
                        <span className="text-white/40">
                          Peak: <span className="text-green-400">{product.expectedPeak || '?'}min</span>                        </span>
                        <span className="text-white/40">
                          Duration: <span className="text-green-400">{product.expectedDuration || '?'}min</span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Add Custom Product */}
          <div className="p-4 border-t border-white/10">
            <button
              className="w-full glass-button flex items-center justify-center gap-2 group"
              onClick={() => {/* TODO: Open custom product form */}}
            >
              <Sparkles className="w-4 h-4 group-hover:text-green-400 transition-colors" />
              <span>Add Custom Product</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};