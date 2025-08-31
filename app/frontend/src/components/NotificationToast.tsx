import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'achievement' | 'info' | 'success' | 'error';
  title: string;
  message?: string;
  icon?: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notifications, 
  onDismiss 
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`
              relative min-w-[300px] p-4 rounded-glass backdrop-blur-panel
              border shadow-glass flex items-start gap-3
              ${notification.type === 'achievement' 
                ? 'bg-gradient-to-r from-accent-primary/30 to-accent-success/20 border-accent-primary/40'
                : notification.type === 'success'
                ? 'bg-accent-success/20 border-accent-success/40'
                : notification.type === 'error'
                ? 'bg-accent-alert/20 border-accent-alert/40'
                : 'bg-glass-tint/60 border-glass-stroke/40'
              }
            `}
          >
            {notification.icon && (
              <div className="text-2xl">{notification.icon}</div>
            )}
            
            <div className="flex-1">
              <h4 className="text-text-primary font-medium">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-text-secondary/80 text-sm mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            
            <button
              onClick={() => onDismiss(notification.id)}
              className="text-text-secondary/40 hover:text-text-primary transition-colors"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return {
    notifications,
    addNotification,
    dismissNotification
  };
}