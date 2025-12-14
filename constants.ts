import { HabitCategory } from './types';
import { Activity, BookOpen, Briefcase, Coffee, DollarSign, Dumbbell, Heart, Moon, Sun, Zap } from 'lucide-react';

export const HABIT_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

export const CATEGORY_ICONS = {
  [HabitCategory.HEALTH]: Heart,
  [HabitCategory.PRODUCTIVITY]: Briefcase,
  [HabitCategory.MINDFULNESS]: Moon,
  [HabitCategory.LEARNING]: BookOpen,
  [HabitCategory.FINANCE]: DollarSign,
  [HabitCategory.OTHER]: Zap,
};

export const MOCK_ADVICE = "I noticed you've been consistent with your health habits this week! Keep it up. Try to stack your reading habit right after your morning coffee to improve consistency there.";
