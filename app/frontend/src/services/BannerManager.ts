import { EventEmitter } from 'events';

export interface Banner {
  id: string;
  text: string;
  type?: 'info' | 'warn' | 'success' | 'error';
  ttlMs?: number;
  sessionId?: string;
}

class BannerManager extends EventEmitter {
  private static instance: BannerManager;
  private shown = new Map<string, number>(); // key -> timestamp
  private queue: Banner[] = [];
  private current: Banner | null = null;
  private isShowing = false;
  private readonly DEDUPE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

  static getInstance(): BannerManager {
    if (!BannerManager.instance) {
      BannerManager.instance = new BannerManager();
    }
    return BannerManager.instance;
  }

  showOnce(banner: Banner) {
    const key = `${banner.sessionId || 'global'}-${banner.id}`;
    const lastShown = this.shown.get(key);
    
    // Dedupe within window
    if (lastShown && Date.now() - lastShown < this.DEDUPE_WINDOW_MS) {
      console.log(`Banner ${key} already shown, skipping`);
      return;
    }

    this.shown.set(key, Date.now());
    this.queue.push(banner);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isShowing || this.queue.length === 0) return;

    this.isShowing = true;
    this.current = this.queue.shift()!;
    this.emit('show', this.current);

    const ttl = this.current.ttlMs || 3000;
    setTimeout(() => {
      this.emit('hide');
      this.current = null;
      this.isShowing = false;
      this.processQueue(); // Process next
    }, ttl);
  }

  clearSession(sessionId: string) {
    // Clear session-specific shown banners
    for (const [key] of this.shown) {
      if (key.startsWith(sessionId)) {
        this.shown.delete(key);
      }
    }
  }

  getCurrentBanner(): Banner | null {
    return this.current;
  }

  clearAll() {
    this.queue = [];
    this.shown.clear();
    this.current = null;
    this.isShowing = false;
    this.emit('hide');
  }
}

export default BannerManager.getInstance();