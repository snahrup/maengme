import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSessionManager } from '../hooks/useSessionManager';

interface SettingsViewProps {
  onClose: () => void;
  config: {
    enablePrimeHints: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  onConfigChange: (config: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  onClose, 
  config, 
  onConfigChange 
}) => {
  const { exportSessions, importSessions } = useSessionManager();
  const [importing, setImporting] = useState(false);
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      await importSessions(file);
      alert('Sessions imported successfully!');
    } catch (err) {
      alert('Error importing sessions');
    }
    setImporting(false);
  };
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
          <h2 className="text-xl font-medium text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Done
          </button>
        </div>
        
        {/* Settings */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Prime Hints Toggle */}
          <div className="mb-6">
            <label className="flex items-center justify-between py-3">
              <div>
                <div className="text-text-primary">Prime Hints</div>
                <div className="text-text-secondary/60 text-sm">
                  Highlight lap types based on your history
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enablePrimeHints}
                onChange={(e) => onConfigChange({ 
                  ...config, 
                  enablePrimeHints: e.target.checked 
                })}                className="w-12 h-6 bg-glass-tint/60 rounded-full relative cursor-pointer peer-checked:bg-accent-primary"
              />
            </label>
          </div>
          
          {/* Sound Toggle */}
          <div className="mb-6">
            <label className="flex items-center justify-between py-3">
              <div>
                <div className="text-text-primary">Sound Effects</div>
                <div className="text-text-secondary/60 text-sm">
                  Play sounds for lap logging
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.soundEnabled}
                onChange={(e) => onConfigChange({ 
                  ...config, 
                  soundEnabled: e.target.checked 
                })}
                className="w-12 h-6 bg-glass-tint/60 rounded-full relative cursor-pointer"
              />
            </label>
          </div>
          
          {/* Export/Import */}
          <div className="border-t border-glass-stroke/20 pt-6">
            <h3 className="text-text-primary mb-4">Data Management</h3>
            
            <button
              onClick={exportSessions}
              className="w-full py-3 bg-glass-tint/40 backdrop-blur-chip rounded-glass text-text-primary font-medium border border-glass-stroke/30 mb-3"
            >
              Export Sessions
            </button>            
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
              <div className="w-full py-3 bg-glass-tint/40 backdrop-blur-chip rounded-glass text-text-primary font-medium border border-glass-stroke/30 text-center cursor-pointer hover:border-glass-stroke/50 transition-colors">
                {importing ? 'Importing...' : 'Import Sessions'}
              </div>
            </label>
          </div>
          
          {/* About */}
          <div className="border-t border-glass-stroke/20 pt-6 mt-6">
            <div className="text-text-secondary/60 text-sm text-center">
              MaengMe v1.0.0
              <br />
              Precision dose tracking
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};