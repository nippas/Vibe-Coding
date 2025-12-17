import React from 'react';
import { DailyPlan, MacroTargets, UserProfile, Region } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultsViewProps {
  targets: MacroTargets;
  plan: DailyPlan;
  profile: UserProfile;
  onReset: () => void;
  region: Region;
}

const COLORS = ['#10b981', '#f59e0b', '#3b82f6']; // Emerald, Amber, Blue

export const ResultsView: React.FC<ResultsViewProps> = ({ targets, plan, profile, onReset, region }) => {
  const macroData = [
    { name: 'Protein', value: targets.protein * 4 },
    { name: 'Carbs', value: targets.carbs * 4 },
    { name: 'Fats', value: targets.fats * 9 },
  ];

  // BMI Calculation
  const heightInMeters = profile.height / 100;
  const bmi = profile.weight / (heightInMeters * heightInMeters);
  let bmiStatus = '';
  let bmiColorClass = '';

  if (bmi < 18.5) {
    bmiStatus = 'Underweight';
    bmiColorClass = 'bg-blue-100 text-blue-700 border-blue-200';
  } else if (bmi < 25) {
    bmiStatus = 'Healthy Weight';
    bmiColorClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  } else if (bmi < 30) {
    bmiStatus = 'Overweight';
    bmiColorClass = 'bg-amber-100 text-amber-700 border-amber-200';
  } else {
    bmiStatus = 'Obese';
    bmiColorClass = 'bg-red-100 text-red-700 border-red-200';
  }

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Your Personalized Plan</h2>
          <p className="text-slate-500 font-medium mt-1">Designed for {region} availability</p>
        </div>
        <button
          onClick={onReset}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Reset Calculator
        </button>
      </div>

      {/* Health Snapshot Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">BMI Score</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{bmi.toFixed(1)}</span>
          </div>
          <div className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg border w-fit ${bmiColorClass}`}>
            {bmiStatus}
          </div>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mb-2">Daily Calories</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-800">{Math.round(targets.calories)}</span>
            <span className="text-sm font-semibold text-emerald-600">kcal</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 w-3/4"></div>
          </div>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-blue-600/70 uppercase tracking-widest mb-2">Daily Protein</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-blue-800">{Math.round(targets.protein)}</span>
            <span className="text-sm font-semibold text-blue-600">g</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 w-1/2"></div>
          </div>
        </div>

        <div className="bg-amber-50/50 p-5 rounded-2xl shadow-sm border border-amber-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="text-xs font-bold text-amber-600/70 uppercase tracking-widest mb-2">Est. Cost</div>
          <div className="flex items-baseline">
            <span className="text-2xl font-extrabold text-amber-800 truncate leading-tight">{plan.summary.estimatedDailyCost}</span>
          </div>
           <div className="mt-3 text-xs font-medium text-amber-700 opacity-80">
            Based on {region} averages
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Meal Plan List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🍽️</span> Daily Menu
          </h3>
          
          <div className="space-y-6">
            {plan.meals.map((meal, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Meal Header */}
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                  <h4 className="font-bold text-xl text-slate-800">{meal.name}</h4>
                  <div className="flex gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm">{meal.totalCalories} kcal</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{meal.totalProtein}g Protein</span>
                  </div>
                </div>
                
                {/* Meal Items */}
                <div className="p-8">
                  <ul className="space-y-6 relative">
                    {/* Vertical line connecting items */}
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 rounded-full"></div>
                    
                    {meal.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex justify-between items-start pl-8 relative">
                        {/* Dot */}
                        <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white bg-emerald-400 shadow-sm z-10"></div>
                        
                        <div className="pr-4">
                          <p className="font-bold text-lg text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{item.name}</p>
                          <p className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block">{item.portion}</p>
                        </div>
                        <div className="text-right flex-shrink-0 flex flex-col items-end">
                          <span className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm mb-1">{item.cost}</span>
                          <span className="text-xs text-slate-400 font-medium">{item.calories} kcal</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {meal.notes && (
                    <div className="mt-8 bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-sm text-amber-900 leading-relaxed">
                      <span className="text-xl">💡</span>
                      <div><span className="font-bold text-amber-800">Chef's Tip:</span> {meal.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

           {/* General Tips Section */}
           <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-lg">
              <span className="text-2xl">🎓</span> Smart Budget Tips
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {plan.summary.tips.map((tip, idx) => (
                <div key={idx} className="bg-white/60 p-4 rounded-xl text-sm text-indigo-900 border border-indigo-100/50 shadow-sm font-medium">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Charts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
            <h3 className="font-bold text-slate-800 mb-6 text-center">Macro Distribution</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${Math.round(value)} kcal`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                   <div className="text-xs text-slate-400 font-bold uppercase">Total</div>
                   <div className="text-xl font-extrabold text-slate-800">{Math.round(targets.calories)}</div>
                 </div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-bold text-emerald-900">Protein</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">{Math.round(targets.protein)}g</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-bold text-amber-900">Carbs</span>
                </div>
                <span className="text-sm font-bold text-amber-700">{Math.round(targets.carbs)}g</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-bold text-blue-900">Fats</span>
                </div>
                <span className="text-sm font-bold text-blue-700">{Math.round(targets.fats)}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};