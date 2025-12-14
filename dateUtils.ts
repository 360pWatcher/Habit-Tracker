export const getTodayISO = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const getLast7Days = (): string[] => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

export const getStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getTodayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  // If not completed today or yesterday, streak is broken (unless completed today)
  if (!sortedDates.includes(today) && !sortedDates.includes(yesterdayISO)) {
      return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  
  // If completed today, start checking from today. If not, start from yesterday.
  if (!sortedDates.includes(today)) {
      currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
      const iso = currentDate.toISOString().split('T')[0];
      if (sortedDates.includes(iso)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
      } else {
          break;
      }
  }
  
  return streak;
};
