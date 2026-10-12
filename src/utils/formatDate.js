/**
 * Date and Time Formatting Utilities
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // Handles "18:00" or ISO
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMins} ${period}`;
  }
  return timeStr;
};

export const formatDateTime = (dateStr, timeStr) => {
  const formattedD = formatDate(dateStr);
  const formattedT = formatTime(timeStr);
  return `${formattedD} • ${formattedT}`;
};

export const calculateCountdown = (eventDateStr, eventTimeStr = '18:00') => {
  if (!eventDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, isCompleted: false };
  }

  const [hours, minutes] = (eventTimeStr || '18:00').split(':').map(Number);
  const eventDate = new Date(eventDateStr);
  eventDate.setHours(hours || 18, minutes || 0, 0, 0);

  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();

  // If within 4 hours after start time, consider live
  const eventDurationMs = 4 * 60 * 60 * 1000;
  if (diffMs <= 0 && diffMs > -eventDurationMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true, isCompleted: false };
  }

  if (diffMs <= -eventDurationMs) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false, isCompleted: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const remainingHours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(remainingHours).padStart(2, '0'),
    minutes: String(remainingMinutes).padStart(2, '0'),
    seconds: String(remainingSeconds).padStart(2, '0'),
    isLive: false,
    isCompleted: false
  };
};
