import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsView } from './components/ResultsView';
import { ShakeGenerator } from './components/ShakeGenerator';
import { UserProfile, Goal, Gender, ActivityLevel, MacroTargets, DailyPlan, MeatType, Region } from './types';
import { generateMealPlan } from './services/geminiService';

enum Tab {
  MEAL_PLANNER = 'meal_planner',
  SHAKE_GENERATOR = 'shake_generator'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MEAL_PLANNER);
  const [region, setRegion] = useState<Region>(Region.SRI_LANKA);
  
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    height: 170,
    weight: 65,
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATE,
    goal: Goal.MAINTAIN,
    meatPreferences: ['Chicken', 'Fish'] as MeatType[],
  });

  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateMacros = (user: UserProfile): MacroTargets => {
    // Mifflin-St Jeor Equation
    let bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age;
    bmr += user.gender === Gender.MALE ? 5 : -161;

    let activityMultiplier = 1.2;
    switch (user.activityLevel) {
      case ActivityLevel.SEDENTARY: activityMultiplier = 1.2; break;
      case ActivityLevel.LIGHT: activityMultiplier = 1.375; break;
      case ActivityLevel.MODERATE: activityMultiplier = 1.55; break;
      case ActivityLevel.ACTIVE: activityMultiplier = 1.725; break;
      case ActivityLevel.VERY_ACTIVE: activityMultiplier = 1.9; break;
    }

    const tdee = bmr * activityMultiplier;
    let targetCalories = tdee;
    let proteinPerKg = 1.0;

    switch (user.goal) {
      case Goal.LOSE_WEIGHT:
        targetCalories = tdee - 500;
        proteinPerKg = 1.6; // Higher protein to preserve muscle during deficit
        break;
      case Goal.GAIN_WEIGHT:
        targetCalories = tdee + 500;
        proteinPerKg = 1.6;
        break;
      case Goal.GAIN_MUSCLE:
        targetCalories = tdee + 300;
        proteinPerKg = 2.0; // High protein for synthesis
        break;
      case Goal.MAINTAIN:
      default:
        targetCalories = tdee;
        proteinPerKg = 1.0; // Standard RDA is 0.8, 1.0 is safer for active
        break;
    }

    const targetProtein = user.weight * proteinPerKg;
    
    // Remaining calories for Carbs/Fats
    // Assume 25% Fat
    const fatCalories = targetCalories * 0.25;
    const fatGrams = fatCalories / 9;
    
    // Rest Carbs
    const proteinCalories = targetProtein * 4;
    const carbCalories = targetCalories - fatCalories - proteinCalories;
    const carbGrams = carbCalories / 4;

    return {
      calories: targetCalories,
      protein: targetProtein,
      fats: fatGrams,
      carbs: carbGrams,
    };
  };

  const handleCalculate = useCallback(async (userProfile: UserProfile) => {
    setLoading(true);
    setError(null);
    setProfile(userProfile);

    try {
      // 1. Calculate math locally first
      const macroTargets = calculateMacros(userProfile);
      setTargets(macroTargets);

      // 2. Generate plan via AI
      const generatedPlan = await generateMealPlan(userProfile, macroTargets, region);
      setPlan(generatedPlan);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [region]);

  const handleReset = () => {
    setPlan(null);
    setTargets(null);
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    if (plan) {
      if (window.confirm("Changing region will reset your current plan. Continue?")) {
        handleReset();
      }
    }
  };

  return (
    <Layout region={region} onRegionChange={handleRegionChange}>
      {/* Modern Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/70 backdrop-blur p-1.5 rounded-2xl shadow-sm border border-slate-200/60 inline-flex relative">
           {/* Animated Background Pill */}
          <div className={`absolute top-1.5 bottom-1.5 rounded-xl bg-emerald-500 shadow-md transition-all duration-300 ease-out z-0
            ${activeTab === Tab.MEAL_PLANNER ? 'left-1.5 w-[140px]' : 'left-[146px] w-[140px]'}
          `}></div>

          <button
            onClick={() => setActiveTab(Tab.MEAL_PLANNER)}
            className={`relative z-10 w-[140px] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300
              ${activeTab === Tab.MEAL_PLANNER 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            Meal Planner
          </button>
          <button
            onClick={() => setActiveTab(Tab.SHAKE_GENERATOR)}
            className={`relative z-10 w-[140px] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors duration-300
              ${activeTab === Tab.SHAKE_GENERATOR 
                ? 'text-white' 
                : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            Quick Shake
          </button>
        </div>
      </div>

      {activeTab === Tab.SHAKE_GENERATOR ? (
        <ShakeGenerator region={region} />
      ) : (
        <>
          {!plan || !targets ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 space-y-3">
                <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                  Eat Smart. <span className="text-emerald-600">Save Money.</span>
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                  Get a personalized AI nutrition plan tailored for <span className="font-extrabold text-slate-900">{region === Region.SRI_LANKA ? 'Sri Lankan cuisine' : 'your lifestyle'}</span> and budget.
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 mb-8 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <div className="bg-red-100 p-2 rounded-full text-red-500">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <CalculatorForm 
                initialProfile={profile} 
                onCalculate={handleCalculate}
                isLoading={loading}
              />
            </div>
          ) : (
            <ResultsView 
              targets={targets} 
              plan={plan}
              profile={profile}
              onReset={handleReset}
              region={region}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;