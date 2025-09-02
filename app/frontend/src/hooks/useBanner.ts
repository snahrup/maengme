import { useEffect, useState } from 'react';
import BannerManager, { Banner } from '../services/BannerManager';

export const useBanner = () => {
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShow = (banner: Banner) => {
      setCurrentBanner(banner);
      setIsVisible(true);
    };

    const handleHide = () => {
      setIsVisible(false);
      setTimeout(() => setCurrentBanner(null), 300); // Wait for animation
    };

    BannerManager.on('show', handleShow);
    BannerManager.on('hide', handleHide);

    return () => {
      BannerManager.off('show', handleShow);
      BannerManager.off('hide', handleHide);
    };
  }, []);

  const showBanner = (banner: Banner) => {
    BannerManager.showOnce(banner);
  };

  const clearSession = (sessionId: string) => {
    BannerManager.clearSession(sessionId);
  };

  return {
    currentBanner,
    isVisible,
    showBanner,
    clearSession
  };
};