import React from 'react';
import { Habit, HabitCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Check, Flame, Trash2 } from 'lucide-react';
import { getTodayISO, getStreak } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onDelete }) => {
  const Icon = CATEGORY_ICONS[habit.category] || CATEGORY_ICONS[HabitCategory.OTHER];
  const today = getTodayISO();
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = getStreak(habit.completedDates);

  return (
    <div className="bg-android-surface rounded-2xl p-4 mb-3 flex items-center justify-between shadow-sm border border-gray-800 relative group overflow-hidden">
      {/* Selection Indicator Background */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isCompletedToday ? 'bg-green-500' : 'bg-transparent'}`}
      />

      <div className="flex items-center space-x-4 z-10 flex-1">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${habit.color}20` }} // 20% opacity
        >
          <Icon size={24} style={{ color: habit.color }} />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg transition-colors ${isCompletedToday ? 'text-gray-400 line-through' : 'text-gray-100'}`}>
            {habit.title}
          </h3>
          <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
            <span className="flex items-center text-orange-400">
              <Flame size={12} className="mr-1" />
              {streak} day streak
            </span>
            <span>•</span>
            <span>{habit.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 z-10">
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Delete habit"
        >
          <Trash2 size={20} />
        </button>

        <button
          onClick={() => onToggle(habit.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 shadow-lg ${
            isCompletedToday 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
          }`}
          aria-label={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check size={24} className={`transition-transform duration-300 ${isCompletedToday ? 'scale-100' : 'scale-0 opacity-0'}`} />
          {!isCompletedToday && <div className="w-3 h-3 rounded-full bg-gray-600" />}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
