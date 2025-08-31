import { describe, it, expect } from 'vitest';
import { formatTime, formatLapTime } from '../utils/timeFormat';

describe('formatTime', () => {
  it('formats milliseconds under 60 minutes as m:ss.mm', () => {
    expect(formatTime(0)).toBe('0:00.00');
    expect(formatTime(1000)).toBe('0:01.00');
    expect(formatTime(23960)).toBe('0:23.96');
    expect(formatTime(599990)).toBe('9:59.99');
    expect(formatTime(3599990)).toBe('59:59.99');
  });
  
  it('switches to h:mm:ss format at exactly 60 minutes', () => {
    expect(formatTime(3599999)).toBe('59:59.99');
    expect(formatTime(3600000)).toBe('1:00:00');
    expect(formatTime(3600001)).toBe('1:00:00');
    expect(formatTime(7200000)).toBe('2:00:00');
    expect(formatTime(36000000)).toBe('10:00:00');
  });
  
  it('handles edge cases', () => {
    expect(formatTime(59999)).toBe('0:59.99');
    expect(formatTime(60000)).toBe('1:00.00');
    expect(formatTime(3599000)).toBe('59:59.00');
  });
});

describe('formatLapTime', () => {
  it('formats lap times in m:ss format', () => {
    expect(formatLapTime(0)).toBe('0:00');
    expect(formatLapTime(1000)).toBe('0:01');
    expect(formatLapTime(59999)).toBe('0:59');
    expect(formatLapTime(60000)).toBe('1:00');
    expect(formatLapTime(3599999)).toBe('59:59');
    expect(formatLapTime(3600000)).toBe('60:00');
  });
});