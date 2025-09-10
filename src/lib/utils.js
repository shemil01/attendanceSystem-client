export function clsx(...classes) {
  return classes.filter(Boolean).join(' ');
}
// format date function
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// format date and time function

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}



// calculate calculate working hours function

export function calculateWorkingHours(checkIn, checkOut, breaks = []) {
  if (!checkIn || !checkOut) return '0:00';
  
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  const totalMs = checkOutTime - checkInTime;
  
  const breakMs = breaks.reduce((total, breakItem) => {
    if (breakItem.start && breakItem.end) {
      return total + (new Date(breakItem.end).getTime() - new Date(breakItem.start).getTime());
    }
    return total;
  }, 0);
  
  const workingMs = totalMs - breakMs;
  const hours = Math.floor(workingMs / (1000 * 60 * 60));
  const minutes = Math.floor((workingMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}


export const formatTime = (minutes) => {
  if (!minutes) return "--:--";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
};