import Dexie, { Table } from 'dexie';
import { Session } from '../types/timer';

export class MaengMeDatabase extends Dexie {
  sessions!: Table<Session>;

  constructor() {
    super('MaengMeDB');
    
    this.version(1).stores({
      sessions: '++id, startTime, createdAt, productPreset'
    });
  }
}

export const db = new MaengMeDatabase();