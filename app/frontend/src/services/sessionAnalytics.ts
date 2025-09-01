// Service for collecting and analyzing session timing data
import { SessionDataPoint, ProductTimingData, UserProfile, EffectMarker } from '../types/sessionAnalytics';
import { db } from '../store/database';

class SessionAnalyticsService {
  private currentSession: SessionDataPoint[] = [];
  private sessionStartTime: number = 0;
  private productId: string = '';

  // Start a new session
  startSession(productId: string, doseAmount: number, doseUnit: 'grams' | 'capsules', lastMeal?: number) {
    this.productId = productId;
    this.sessionStartTime = Date.now();
    this.currentSession = [];

    const startPoint: SessionDataPoint = {
      sessionId: `session_${Date.now()}`,
      productId,
      timestamp: 0,
      eventType: 'session_start',
      metadata: {
        doseAmount,
        doseUnit,
        lastMeal,
        phase: 'pre-onset'
      }
    };

    this.currentSession.push(startPoint);
    this.saveDataPoint(startPoint);
  }
  // Log a lap (user-initiated timing marker)
  logLap(notes?: string) {
    const elapsed = Date.now() - this.sessionStartTime;
    const lapPoint: SessionDataPoint = {
      sessionId: this.currentSession[0]?.sessionId || '',
      productId: this.productId,
      timestamp: elapsed,
      eventType: 'lap',
      metadata: {
        phase: this.determinePhase(elapsed),
        notes
      }
    };

    this.currentSession.push(lapPoint);
    this.saveDataPoint(lapPoint);
  }

  // Log effect noticed by user
  logEffect(effectStrength: number, effects: string[], notes?: string) {
    const elapsed = Date.now() - this.sessionStartTime;
    const effectPoint: SessionDataPoint = {
      sessionId: this.currentSession[0]?.sessionId || '',
      productId: this.productId,
      timestamp: elapsed,
      eventType: 'effect_noted',
      metadata: {
        phase: this.determinePhase(elapsed),
        effectStrength,
        notes
      }
    };

    this.currentSession.push(effectPoint);
    this.saveDataPoint(effectPoint);
    
    // Auto-detect onset if this is first effect > 3 strength
    this.detectOnset(elapsed, effectStrength);
  }
  // Auto-detect onset based on effect strength
  private detectOnset(elapsed: number, strength: number) {
    const hasOnset = this.currentSession.some(p => p.eventType === 'phase_change' && p.metadata?.phase === 'onset');
    
    if (!hasOnset && strength >= 3) {
      const onsetPoint: SessionDataPoint = {
        sessionId: this.currentSession[0]?.sessionId || '',
        productId: this.productId,
        timestamp: elapsed,
        eventType: 'phase_change',
        metadata: {
          phase: 'onset'
        }
      };
      
      this.currentSession.push(onsetPoint);
      this.saveDataPoint(onsetPoint);
      this.updateProductTiming('onset', elapsed);
    }
  }

  // Determine current phase based on elapsed time
  private determinePhase(elapsed: number): 'pre-onset' | 'onset' | 'peak' | 'tail' {
    const minutes = elapsed / 60000;
    
    // These are defaults, will be replaced by ML predictions
    if (minutes < 10) return 'pre-onset';
    if (minutes < 30) return 'onset';
    if (minutes < 60) return 'peak';
    return 'tail';
  }

  // Save data point to database
  private async saveDataPoint(point: SessionDataPoint) {
    try {
      await db.sessionAnalytics.add(point);
    } catch (error) {
      console.error('Failed to save analytics point:', error);
    }
  }
  // Update aggregated product timing stats
  private async updateProductTiming(phase: 'onset' | 'peak' | 'duration', value: number) {
    try {
      const existing = await db.productTimings.get(this.productId);
      
      if (existing) {
        // Update running averages
        const stats = existing.aggregatedStats;
        const n = stats.sampleSize;
        
        if (phase === 'onset') {
          stats.averageOnset = (stats.averageOnset * n + value) / (n + 1);
        } else if (phase === 'peak') {
          stats.averagePeak = (stats.averagePeak * n + value) / (n + 1);
        } else if (phase === 'duration') {
          stats.averageDuration = (stats.averageDuration * n + value) / (n + 1);
        }
        
        stats.sampleSize = n + 1;
        stats.lastUpdated = Date.now();
        
        await db.productTimings.update(this.productId, { aggregatedStats: stats });
      } else {
        // Create new timing record
        const newTiming: ProductTimingData = {
          productId: this.productId,
          sessions: [this.currentSession],
          aggregatedStats: {
            averageOnset: phase === 'onset' ? value : 0,
            onsetStdDev: 0,
            averagePeak: phase === 'peak' ? value : 0,
            peakStdDev: 0,
            averageDuration: phase === 'duration' ? value : 0,
            durationStdDev: 0,
            sampleSize: 1,
            lastUpdated: Date.now()
          }
        };
        
        await db.productTimings.add(newTiming);
      }
    } catch (error) {
      console.error('Failed to update product timing:', error);
    }
  }

  // End session and calculate final metrics
  async endSession() {
    const elapsed = Date.now() - this.sessionStartTime;
    
    const endPoint: SessionDataPoint = {
      sessionId: this.currentSession[0]?.sessionId || '',
      productId: this.productId,
      timestamp: elapsed,
      eventType: 'session_end',
      metadata: {
        phase: 'tail'
      }
    };
    
    this.currentSession.push(endPoint);
    this.saveDataPoint(endPoint);
    this.updateProductTiming('duration', elapsed);
    
    // Reset for next session
    this.currentSession = [];
    this.sessionStartTime = 0;
    this.productId = '';
  }
}

export const sessionAnalytics = new SessionAnalyticsService();
