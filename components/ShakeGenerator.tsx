import React, { useState } from 'react';
import { ShakeRecipe, Region } from '../types';
import { generateShakeRecipe } from '../services/geminiService';

interface ShakeGeneratorProps {
  region: Region;
}

const INGREDIENTS = [
  { 
    category: 'Liquid Base', 
    items: ['Water', 'Fresh Milk', 'King Coconut Water', 'Coconut Milk', 'Soy Milk', 'Iced Coffee', 'Almond Milk'] 
  },
  { 
    category: 'Protein Power', 
    items: ['Whey Protein', 'Yogurt / Curd', 'Peanuts', 'Cashews (Caju)', 'Egg Whites (Pasteurized)', 'Chickpeas'] 
  },
  { 
    category: 'Fruits & Veg', 
    items: ['Banana', 'Avocado', 'Papaya', 'Mango', 'Woodapple', 'Pineapple', 'Passion Fruit', 'Rambutan', 'Dates'] 
  },
  { 
    category: 'Flavor & Boosters', 
    items: ['Oats', 'Milo', 'Samaposha', 'Peanut Butter', 'Kithul Treacle', 'Honey', 'Chia Seeds', 'Cinnamon', 'Ginger', 'Cardamom'] 
  },
];

export const ShakeGenerator: React.FC<ShakeGeneratorProps> = ({ region }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<ShakeRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (item: string) => {
    setSelected(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    if (selected.length < 2) {
      setError("Please select at least 2 ingredients.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateShakeRecipe(selected, region);
      setRecipe(result);
    } catch (e) {
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-16">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Mix Your Perfect Shake</h2>
        <p className="text-slate-600 max-w-lg mx-auto text-lg font-medium">
          Select available ingredients from your {region === Region.SRI_LANKA ? '🇱🇰 Local Kitchen' : '🌎 Pantry'}, and AI will craft the perfect recipe.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="grid gap-10">
          {INGREDIENTS.map((cat) => (
            <div key={cat.category}>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {cat.category}
              </h4>
              <div className="flex flex-wrap gap-3">
                {cat.items.map((item) => {
                  const isSelected = selected.includes(item);
                  return (
                    <button 
                      key={item}
                      onClick={() => toggleIngredient(item)}
                      className={`
                        px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border
                        ${isSelected 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md'}
                      `}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
             <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
             <span className="font-medium">{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || selected.length === 0}
          className={`mt-12 w-full py-5 rounded-2xl font-bold text-white text-xl shadow-xl transition-all duration-200
            ${loading 
              ? 'bg-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 hover:shadow-emerald-300 hover:-translate-y-1 active:scale-95'}
          `}
        >
          {loading ? 'Thinking...' : 'Generate Magic Recipe ✨'}
        </button>
      </div>

      {recipe && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ring-4 ring-emerald-50/30 animate-fade-in-up">
          {/* Header */}
          <div className="relative bg-slate-900 p-10 text-center overflow-hidden">
            {/* Background blobs for visual flair */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-slate-900 to-slate-900"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm border border-emerald-500/30">AI Chef Choice</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">{recipe.name}</h3>
              <p className="text-slate-300 italic text-lg max-w-2xl mx-auto font-medium">"{recipe.tip}"</p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Ingredients List */}
              <div className="space-y-6">
                <h4 className="flex items-center text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">
                  <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">🥥</span> 
                  Ingredients
                </h4>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{ing.name}</span>
                      <span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm text-sm border border-slate-100">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Macros Panel */}
              <div className="space-y-6">
                 <h4 className="flex items-center text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">⚡</span> 
                  Nutrition Estimate
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-5 rounded-2xl text-center border border-emerald-100 flex flex-col justify-center shadow-sm">
                    <div className="text-4xl font-extrabold text-emerald-600">{recipe.macros.protein}<span className="text-lg">g</span></div>
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-1">Protein</div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200 flex flex-col justify-center shadow-sm">
                    <div className="text-3xl font-bold text-slate-700">{recipe.macros.calories}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Calories</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200 shadow-sm">
                    <div className="text-xl font-bold text-slate-700">{recipe.macros.carbs}g</div>
                    <div className="text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Carbs</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200 shadow-sm">
                    <div className="text-xl font-bold text-slate-700">{recipe.macros.fats}g</div>
                    <div className="text-xxs font-bold text-slate-500 uppercase tracking-widest mt-1">Fats</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h4 className="flex items-center text-xl font-bold text-slate-800 mb-6">
                 <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-lg">🥣</span> 
                 Preparation Steps
              </h4>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-5 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 border border-slate-200">{i + 1}</span>
                    <p className="text-slate-700 mt-1 leading-relaxed font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};