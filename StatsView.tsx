import React, { useMemo } from 'react';
import { Habit } from '../types';
import { getLast7Days } from '../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

interface StatsViewProps {
  habits: Habit[];
}

const StatsView: React.FC<StatsViewProps> = ({ habits }) => {
  const last7Days = getLast7Days();

  const data = useMemo(() => {
    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const completedCount = habits.reduce((acc, habit) => {
        return acc + (habit.completedDates.includes(date) ? 1 : 0);
      }, 0);
      return {
        date,
        day: dayName,
        completed: completedCount
      };
    }).reverse();
  }, [habits, last7Days]);

  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const totalActiveHabits = habits.length;
  
  // Calculate average consistency score (simple metric)
  const consistencyScore = totalActiveHabits > 0 
    ? Math.round((data.reduce((acc, d) => acc + d.completed, 0) / (totalActiveHabits * 7)) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-white px-1">Weekly Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-android-surface p-4 rounded-2xl border border-gray-800 flex flex-col justify-between h-32">
          <div className="p-2 bg-blue-500/20 w-fit rounded-lg">
             <Trophy className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{totalCompletions}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Check-ins</p>
          </div>
        </div>
        <div className="bg-android-surface p-4 rounded-2xl border border-gray-800 flex flex-col justify-between h-32">
          <div className="p-2 bg-green-500/20 w-fit rounded-lg">
             <TrendingUp className="text-green-400" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{consistencyScore}%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">7-Day Consistency</p>
          </div>
        </div>
      </div>

      <div className="bg-android-surface p-6 rounded-2xl border border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-200">Activity (Last 7 Days)</h3>
          <Calendar size={18} className="text-gray-500" />
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#374151', opacity: 0.2 }}
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="completed" radius={[4, 4, 4, 4]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed > 0 ? '#3B82F6' : '#1F2937'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Top Habits</h3>
        <div className="space-y-3">
            {[...habits]
                .sort((a, b) => b.completedDates.length - a.completedDates.length)
                .slice(0, 3)
                .map(h => (
                    <div key={h.id} className="flex items-center justify-between bg-android-surface p-3 rounded-xl border border-gray-800">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: h.color}} />
                            <span className="text-gray-300">{h.title}</span>
                        </div>
                        <span className="text-sm font-mono text-gray-500">{h.completedDates.length}</span>
                    </div>
                ))
            }
        </div>
      </div>
    </div>
  );
};

export default StatsView;
