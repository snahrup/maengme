/**
 * Format milliseconds to timer display string
 * Under 60 minutes: m:ss.mmm (e.g., "0:23.960")
 * At/over 60 minutes: h:mm:ss (e.g., "1:00:00")
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // centiseconds
  
  // Switch to h:mm:ss format at exactly 60 minutes
  if (ms >= 3600000) { // 60 * 60 * 1000
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Use m:ss.mmm format for under 60 minutes
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

/**
 * Format time for lap display (always m:ss format)
 */
export function formatLapTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}