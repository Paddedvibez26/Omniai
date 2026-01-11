
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  image: string;
  onClose: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, image, onClose }) => {
  const handleCopy = () => {
    const text = `
OmniScan AI Analysis:
Name: ${result.name}
Category: ${result.category}
Safety: ${result.safetyStatus}
Confidence: ${Math.round(result.confidence * 100)}%

Description: ${result.description}

Recommendations:
${result.recommendations.map(r => '- ' + r).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    alert('Analysis copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-[60] overflow-y-auto pb-10">
      <div className="relative h-72">
        <img src={`data:image/jpeg;base64,${image}`} className="w-full h-full object-cover" alt="Scanned object" />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <i className="fas fa-xmark text-lg"></i>
          </button>
          <button onClick={handleCopy} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <i className="fas fa-copy text-lg"></i>
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {Math.round(result.confidence * 100)}% Confidence
          </span>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">{result.name}</h1>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mt-1">{result.category}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-xl flex items-center gap-2 border ${
              result.safetyStatus === 'safe' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              result.safetyStatus === 'caution' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              'bg-red-50 text-red-600 border-red-100'
            }`}>
              <i className={`fas ${result.safetyStatus === 'safe' ? 'fa-check-circle' : 'fa-triangle-exclamation'}`}></i>
              <span className="font-bold text-xs uppercase">{result.safetyStatus}</span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-2 bg-blue-50/30 rounded-r-lg mb-6">
            "{result.description}"
          </p>

          {result.nutrition && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-pie text-blue-500"></i> Nutrition Insights
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Cal</div>
                  <div className="text-sm font-bold text-blue-600">{result.nutrition.calories}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pro</div>
                  <div className="text-sm font-bold text-blue-600">{result.nutrition.protein}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Fat</div>
                  <div className="text-sm font-bold text-blue-600">{result.nutrition.fat}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Carb</div>
                  <div className="text-sm font-bold text-blue-600">{result.nutrition.carbs}</div>
                </div>
              </div>
              <div className="space-y-2">
                {result.nutrition.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50 p-3 rounded-xl">
                    <i className="fas fa-check text-green-500 mt-1"></i>
                    <span className="text-sm text-green-800 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.plantInfo && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-seedling text-green-500"></i> Care & Safety
              </h3>
              <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Scientific Name</span>
                  <span className="text-sm font-bold italic">{result.plantInfo.scientificName}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Watering</span>
                    <p className="text-xs text-gray-700">{result.plantInfo.careInstructions.watering}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Sunlight</span>
                    <p className="text-xs text-gray-700">{result.plantInfo.careInstructions.sunlight}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <i className="fas fa-lightbulb text-amber-500"></i> Key Recommendations
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
