import React, { useState } from 'react';
import { HabitCategory } from '../types';
import { HABIT_COLORS, CATEGORY_ICONS } from '../constants';
import { X, Check } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: HabitCategory, color: string, target: number) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>(HabitCategory.HEALTH);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [target, setTarget] = useState(7);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category, color, target);
    setTitle('');
    setCategory(HabitCategory.HEALTH);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-[#1E1E1E] w-full max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">New Habit</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Habit Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 10 pages"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(HabitCategory).map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                        : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600'
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
             <div className="flex justify-between bg-gray-900 p-3 rounded-xl border border-gray-700">
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={14} className="text-white drop-shadow-md" />}
                  </button>
                ))}
             </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            Create Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
