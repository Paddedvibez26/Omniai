
import React, { useState, useEffect } from 'react';
import { AppTab, ScanMode, AnalysisResult, UserProfile } from './types';
import BottomNav from './components/BottomNav';
import CameraScanner from './components/CameraScanner';
import ResultCard from './components/ResultCard';
import { analyzeImage, generateMealPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{result: AnalysisResult, image: string} | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex',
    goal: 'Gain lean muscle',
    dietPreference: 'Balanced',
    healthScore: 88,
    totalScans: 42
  });
  const [showPermissions, setShowPermissions] = useState(true);

  const handleScan = async (base64: string, mode: ScanMode) => {
    setIsScannerOpen(false);
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(base64, mode, { 
        goal: userProfile.goal, 
        preference: userProfile.dietPreference 
      });
      setAnalysisResult({ result, image: base64 });
      setUserProfile(prev => ({ ...prev, totalScans: prev.totalScans + 1 }));
    } catch (err) {
      alert("Analysis failed. Please check your internet connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHome = () => (
    <div className="p-5 pb-32 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">OmniScan AI</h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">Your Intelligent Visual Assistant</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <i className="fas fa-info text-sm"></i>
        </button>
      </header>

      {/* Hero Card */}
      <div 
        onClick={() => setIsScannerOpen(true)}
        className="relative bg-blue-600 rounded-3xl p-6 overflow-hidden shadow-xl shadow-blue-200 active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>
        <div className="absolute right-10 top-10 text-white/20"><i className="fas fa-sparkles text-4xl"></i></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <i className="fas fa-camera text-2xl text-white"></i>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Scan Anything</h2>
            <p className="text-blue-100 text-sm opacity-80 mt-1">AI identifies food, plants & more</p>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick Shortcuts</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => { setActiveTab(AppTab.SCAN); setIsScannerOpen(true); }}
            className="bg-white p-5 rounded-3xl flex flex-col items-center gap-3 custom-shadow active:bg-gray-50"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
              <i className="fas fa-bowl-food text-xl"></i>
            </div>
            <span className="font-bold text-gray-700 text-sm">Scan Food</span>
          </button>
          <button 
            onClick={() => { setActiveTab(AppTab.PLANTS); setIsScannerOpen(true); }}
            className="bg-white p-5 rounded-3xl flex flex-col items-center gap-3 custom-shadow active:bg-gray-50"
          >
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <i className="fas fa-leaf text-xl"></i>
            </div>
            <span className="font-bold text-gray-700 text-sm">Scan Plants</span>
          </button>
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="bg-white p-5 rounded-3xl flex flex-col items-center gap-3 custom-shadow active:bg-gray-50"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
              <i className="fas fa-image text-xl"></i>
            </div>
            <span className="font-bold text-gray-700 text-sm">Upload Image</span>
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.MEALS)}
            className="bg-white p-5 rounded-3xl flex flex-col items-center gap-3 custom-shadow active:bg-gray-50"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <i className="fas fa-clock text-xl"></i>
            </div>
            <span className="font-bold text-gray-700 text-sm">Daily Plan</span>
          </button>
        </div>
      </div>

      {/* Tip Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <i className="fas fa-sparkles text-blue-400"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Nutrition Tip</span>
        </div>
        <p className="text-lg font-medium leading-relaxed">
          Eating protein within 30 minutes of your workout helps muscles recover faster.
        </p>
      </div>

      {/* Bottom Listing */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Meal Suggestions</h3>
          <button className="text-blue-600 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
            View All <i className="fas fa-chevron-right text-[8px]"></i>
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Quinoa Power Bowl', cal: '450 kcal', tag: 'High Protein', icon: 'fa-bowl-rice', color: 'text-orange-500', bg: 'bg-orange-50' },
            { name: 'Grilled Salmon', cal: '320 kcal', tag: 'Omega-3', icon: 'fa-fish', color: 'text-blue-500', bg: 'bg-blue-50' }
          ].map((meal, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 custom-shadow">
              <div className={`w-14 h-14 ${meal.bg} ${meal.color} rounded-2xl flex items-center justify-center text-xl`}>
                <i className={`fas ${meal.icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{meal.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400 font-medium">{meal.cal}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">{meal.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-5 pb-32 space-y-8">
      <header className="text-center pt-10">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-5xl font-bold mb-4 mx-auto relative overflow-hidden">
            {userProfile.name[0]}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          </div>
          <div className="absolute -right-2 -bottom-0 w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-md">
            <i className="fas fa-medal"></i>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{userProfile.name}</h2>
        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{userProfile.goal}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl text-center custom-shadow">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Scans</div>
          <div className="text-3xl font-black text-slate-800">{userProfile.totalScans}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl text-center custom-shadow">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Health Score</div>
          <div className="text-3xl font-black text-emerald-500">{userProfile.healthScore}</div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-4 custom-shadow">
        <h3 className="px-4 pt-4 pb-6 text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Settings & Privacy</h3>
        <div className="space-y-1">
          {[
            { icon: 'fa-gear', label: 'Preferences', value: userProfile.dietPreference.toLowerCase(), color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: 'fa-bell', label: 'Notifications', value: 'Enabled', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: 'fa-clock-rotate-left', label: 'Scan History', value: '', color: 'text-purple-500', bg: 'bg-purple-50' }
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{item.value}</span>
                <i className="fas fa-chevron-right text-gray-300 text-[10px]"></i>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlants = () => (
    <div className="p-5 pb-32 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Plant Doctor</h1>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">Identify species and care requirements</p>
      </header>

      <div className="bg-white p-10 rounded-[3rem] text-center custom-shadow flex flex-col items-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 text-3xl mb-6">
          <i className="fas fa-leaf"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Identify a Plant</h2>
        <p className="text-gray-400 text-sm mb-8 px-6">Instantly check toxicity and care needs for any plant species.</p>
        <button 
          onClick={() => { setActiveTab(AppTab.SCAN); setIsScannerOpen(true); }}
          className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
        >
          Open Camera
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Essential Care Tips</h3>
        <div className="bg-white p-6 rounded-3xl custom-shadow flex gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
            <i className="fas fa-droplet"></i>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Water Schedule</h4>
            <p className="text-sm text-gray-500 leading-relaxed mt-1">
              Overwatering is the #1 killer. Check the top inch of soil before adding more water.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* Onboarding / Permissions Simulation */}
      {showPermissions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 text-3xl mx-auto mb-6">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Allow this app to request access to:</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl text-left">
                <i className="fas fa-check-square text-blue-600 text-lg"></i>
                <div className="flex-1">
                  <span className="block font-bold text-gray-700 text-sm">Camera</span>
                  <span className="text-xs text-gray-400">Used for scanning objects</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowPermissions(false)}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              Allow
            </button>
            <p className="text-[10px] text-gray-400 mt-6 leading-tight">
              The app may not work properly without these permissions.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
        {activeTab === AppTab.HOME && renderHome()}
        {activeTab === AppTab.PROFILE && renderProfile()}
        {activeTab === AppTab.PLANTS && renderPlants()}
        {activeTab === AppTab.MEALS && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-10 text-center">
             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-gray-500 font-medium">Designing your meal plan...</p>
          </div>
        )}
      </main>

      {/* Global Components */}
      {isScannerOpen && (
        <CameraScanner 
          onCapture={handleScan}
          onClose={() => setIsScannerOpen(false)}
          initialMode={activeTab === AppTab.PLANTS ? ScanMode.PLANT : activeTab === AppTab.MEALS ? ScanMode.FOOD : ScanMode.GENERAL}
        />
      )}

      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-bold text-slate-800">OmniScan AI</h2>
          <p className="text-slate-400 font-medium animate-pulse mt-2">Thinking...</p>
        </div>
      )}

      {analysisResult && (
        <ResultCard 
          result={analysisResult.result}
          image={analysisResult.image}
          onClose={() => setAnalysisResult(null)}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        if (tab === AppTab.SCAN) setIsScannerOpen(true);
        else setActiveTab(tab);
      }} />
    </div>
  );
};

export default App;
