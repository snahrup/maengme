import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useBanner } from '../hooks/useBanner';

export const BannerDisplay: React.FC = () => {
  const { currentBanner, isVisible } = useBanner();

  if (!currentBanner) return null;

  const getBannerStyle = () => {
    switch (currentBanner.type) {
      case 'warn':
        return 'bg-yellow-500/90';
      case 'error':
        return 'bg-red-500/90';
      case 'success':
        return 'bg-green-500/90';
      default:
        return 'bg-blue-500/90';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="fixed top-20 left-4 right-4 z-50"
        >
          <div className={`${getBannerStyle()} rounded-xl p-4 shadow-2xl backdrop-blur-md`}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <p className="text-white font-medium flex-1 text-sm">
                {currentBanner.text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};