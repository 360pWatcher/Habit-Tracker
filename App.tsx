import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory } from './types';
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import StatsView from './components/StatsView';
import AICoach from './components/AICoach';
import { getTodayISO } from './utils/dateUtils';
import { Plus, LayoutDashboard, BarChart2, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'orbit_habits_data';

enum Tab {
  HABITS = 'habits',
  STATS = 'stats',
  COACH = 'coach'
}

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HABITS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setHabits(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load habits", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, isLoading]);

  const addHabit = (title: string, category: HabitCategory, color: string, targetPerWeek: number) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      category,
      color,
      createdAt: new Date().toISOString(),
      completedDates: [],
      targetPerWeek
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      
      const today = getTodayISO();
      const isCompleted = h.completedDates.includes(today);
      
      let newDates;
      if (isCompleted) {
        newDates = h.completedDates.filter(d => d !== today);
      } else {
        newDates = [...h.completedDates, today];
      }
      
      return { ...h, completedDates: newDates };
    }));
  };

  const deleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
        setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HABITS:
        return (
          <div className="pb-24 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6 px-1">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Today</h1>
                <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="bg-android-surface px-3 py-1 rounded-full border border-gray-800">
                  <span className="text-xs text-gray-400 font-medium">{habits.filter(h => h.completedDates.includes(getTodayISO())).length}/{habits.length} Done</span>
              </div>
            </header>
            
            {habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-800 rounded-2xl">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <LayoutDashboard className="text-gray-500" />
                </div>
                <h3 className="text-gray-300 font-semibold mb-2">No habits yet</h3>
                <p className="text-gray-500 text-sm mb-4">Start small. Add your first habit to begin your journey.</p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-400 font-medium hover:underline"
                >
                    Create a habit
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {habits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onToggle={toggleHabit} 
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case Tab.STATS:
        return <StatsView habits={habits} />;
      case Tab.COACH:
        return <AICoach habits={habits} />;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-android-bg flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-android-bg text-gray-100 font-sans selection:bg-blue-500/30">
      <main className="max-w-md mx-auto min-h-screen p-5 relative">
        {renderContent()}
      </main>

      {/* Floating Action Button for Add (Only on Habits tab) */}
      {activeTab === Tab.HABITS && (
        <div className="fixed bottom-24 right-6 md:right-[calc(50%-220px+24px)] z-40">
            <button
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white"
            aria-label="Add Habit"
            >
            <Plus size={28} />
            </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#121212]/90 backdrop-blur-md border-t border-gray-800 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <button
            onClick={() => setActiveTab(Tab.HABITS)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.HABITS ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <LayoutDashboard size={22} strokeWidth={activeTab === Tab.HABITS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Habits</span>
          </button>
          
          <button
            onClick={() => setActiveTab(Tab.STATS)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.STATS ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <BarChart2 size={22} strokeWidth={activeTab === Tab.STATS ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
          
          <button
            onClick={() => setActiveTab(Tab.COACH)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === Tab.COACH ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Sparkles size={22} strokeWidth={activeTab === Tab.COACH ? 2.5 : 2} className={activeTab === Tab.COACH ? "animate-pulse" : ""} />
            <span className="text-[10px] font-medium">Coach</span>
          </button>
        </div>
      </nav>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default App;