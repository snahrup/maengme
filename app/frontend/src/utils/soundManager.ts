export class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = false;
  
  constructor() {
    this.preloadSounds();
  }
  
  private preloadSounds() {
    // Create data URI sounds for instant playback
    const sounds = {
      tap: this.createBeep(200, 0.1, 440),
      success: this.createBeep(300, 0.2, 880),
      start: this.createBeep(400, 0.3, 523),
      end: this.createBeep(500, 0.3, 261)
    };
    
    Object.entries(sounds).forEach(([name, dataUri]) => {
      const audio = new Audio(dataUri);
      audio.volume = 0.3;
      this.sounds[name] = audio;
    });
  }
  
  private createBeep(duration: number, volume: number, frequency: number): string {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    // Create a simple beep data URI
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBiuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }
}

export const soundManager = new SoundManager();