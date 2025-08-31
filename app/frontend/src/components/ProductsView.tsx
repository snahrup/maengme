import React, { useState } from 'react';
import { motion } from 'framer-motion';
import productsData from '../data/products.json';

interface ProductsViewProps {
  onClose: () => void;
  onSelectProduct?: (product: any) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onClose, onSelectProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'capsule' | 'powder'>('all');
  
  const filteredProducts = productsData.filter(product => 
    selectedCategory === 'all' || 
    product.ingestion.toLowerCase() === selectedCategory
  );
  
  // const manufacturers = [...new Set(productsData.map(p => p.manufacturer))];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg-start/95 backdrop-blur-lg z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-stroke/20">
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-xl font-medium text-text-primary">Products</h2>
          <div className="w-12" />
        </div>        
        {/* Category Filter */}
        <div className="px-6 py-3 flex gap-2">
          {(['all', 'capsule', 'powder'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-accent-primary text-white'
                  : 'bg-glass-tint/40 text-text-secondary border border-glass-stroke/30'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.button
                key={index}
                onClick={() => onSelectProduct?.(product)}
                className="bg-glass-tint/40 backdrop-blur-chip rounded-glass p-3 border border-glass-stroke/30 hover:border-accent-primary/50 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-square bg-glass-tint/20 rounded-lg mb-2 overflow-hidden">
                  <img 
                    src={`/products/${product.image.split('/').pop()}`}
                    alt={product.manufacturer}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-left">
                  <div className="text-text-primary text-sm font-medium">
                    {product.manufacturer}
                  </div>
                  <div className="text-text-secondary/60 text-xs">
                    {product.ingestion}
                    {product.strain && ` • ${product.strain}`}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Add Custom Product */}
          <button className="w-full mt-6 py-3 bg-glass-tint/40 backdrop-blur-chip rounded-glass text-text-primary font-medium border border-dashed border-glass-stroke/50 hover:border-accent-primary/50 transition-colors">
            + Add Custom Product
          </button>
        </div>
      </div>
    </motion.div>
  );
};