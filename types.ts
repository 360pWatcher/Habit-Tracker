export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  color: string;
  createdAt: string; // ISO Date
  completedDates: string[]; // Array of YYYY-MM-DD
  targetPerWeek: number;
}

export enum HabitCategory {
  HEALTH = 'Health',
  PRODUCTIVITY = 'Productivity',
  MINDFULNESS = 'Mindfulness',
  LEARNING = 'Learning',
  FINANCE = 'Finance',
  OTHER = 'Other'
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AIAdvice {
  content: string;
  timestamp: number;
}
