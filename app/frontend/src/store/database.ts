import Dexie, { Table } from 'dexie';
import { Session } from '../types/timer';
import { SessionDataPoint, ProductTimingData, UserProfile } from '../types/sessionAnalytics';

export class MaengMeDatabase extends Dexie {
  sessions!: Table<Session>;
  sessionAnalytics!: Table<SessionDataPoint>;
  productTimings!: Table<ProductTimingData>;
  userProfiles!: Table<UserProfile>;

  constructor() {
    super('MaengMeDB');
    
    // Version 1: Original schema
    this.version(1).stores({
      sessions: '++id, startTime, createdAt, productPreset'
    });
    
    // Version 2: Add analytics tables
    this.version(2).stores({
      sessions: '++id, startTime, createdAt, productPreset',
      sessionAnalytics: '++id, sessionId, productId, timestamp, eventType',
      productTimings: 'productId, lastUpdated',
      userProfiles: 'userId, lastSessionAt'
    });
  }
}

export const db = new MaengMeDatabase();