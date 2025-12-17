import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Goal, MeatType } from '../types';

interface CalculatorFormProps {
  initialProfile: UserProfile;
  onCalculate: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ initialProfile, onCalculate, isLoading }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' ? Number(value) : value,
    }));
  };

  const handleMeatToggle = (meat: MeatType) => {
    setProfile(prev => {
      const current = prev.meatPreferences || [];
      if (current.includes(meat)) {
        return { ...prev, meatPreferences: current.filter(m => m !== meat) };
      } else {
        return { ...prev, meatPreferences: [...current, meat] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(profile);
  };

  const meatOptions: { type: MeatType; icon: string }[] = [
    { type: 'Chicken', icon: '🍗' },
    { type: 'Fish', icon: '🐟' },
    { type: 'Beef', icon: '🥩' },
    { type: 'Pork', icon: '🍖' }
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-10 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
        {/* Basic Stats */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">1</span>
            <h2 className="text-xl font-bold text-slate-800">Your Stats</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none"
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Age</label>
              <input
                type="number"
                name="age"
                min="10"
                max="100"
                value={profile.age}
                onChange={handleChange}
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Height <span className="text-slate-400 font-normal">(cm)</span></label>
              <input
                type="number"
                name="height"
                min="100"
                max="250"
                value={profile.height}
                onChange={handleChange}
                placeholder="170"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Weight <span className="text-slate-400 font-normal">(kg)</span></label>
              <input
                type="number"
                name="weight"
                min="30"
                max="200"
                value={profile.weight}
                onChange={handleChange}
                placeholder="65"
                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Goals & Lifestyle */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">2</span>
            <h2 className="text-xl font-bold text-slate-800">Goal & Lifestyle</h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Activity Level</label>
            <div className="relative">
              <select
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleChange}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none truncate pr-8"
              >
                {Object.values(ActivityLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Your Goal</label>
            <div className="relative">
              <select
                name="goal"
                value={profile.goal}
                onChange={handleChange}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 font-bold transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:outline-none"
              >
                {Object.values(Goal).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meat Preferences */}
      <div className="pt-8 border-t border-slate-100 relative">
         <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">3</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Dietary Preferences</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Select the meats you consume. (We include vegetarian staples by default)</p>
            </div>
         </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {meatOptions.map(option => {
              const isSelected = profile.meatPreferences.includes(option.type);
              return (
                <label key={option.type} className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'bg-emerald-50/50 border-emerald-500 shadow-emerald-100 shadow-md' 
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-white'}
                `}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleMeatToggle(option.type)}
                    className="hidden"
                  />
                  <span className="text-3xl mb-2">{option.icon}</span>
                  <span className={`font-bold text-sm ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>{option.type}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </label>
              );
            })}
          </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-200
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed transform-none shadow-none' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 hover:shadow-emerald-200 hover:shadow-xl hover:-translate-y-1 active:scale-95'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Optimizing Diet Plan...
            </span>
          ) : 'Generate My Meal Plan'}
        </button>
      </div>
    </form>
  );
};