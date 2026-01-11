
import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const NavItem = ({ tab, icon, label }: { tab: AppTab, icon: string, label: string }) => (
    <button 
      onClick={() => onTabChange(tab)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-200 ${
        activeTab === tab ? 'text-blue-600' : 'text-gray-400'
      }`}
    >
      <i className={`fas ${icon} text-lg mb-1`}></i>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-between px-2 safe-bottom z-50">
      <NavItem tab={AppTab.HOME} icon="fa-house" label="Home" />
      <NavItem tab={AppTab.MEALS} icon="fa-calendar-days" label="Meals" />
      
      <div className="relative -top-6 flex flex-col items-center">
        <button 
          onClick={() => onTabChange(AppTab.SCAN)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
            activeTab === AppTab.SCAN ? 'bg-blue-700' : 'bg-slate-800'
          }`}
        >
          <i className="fas fa-expand text-2xl"></i>
        </button>
      </div>

      <NavItem tab={AppTab.PLANTS} icon="fa-leaf" label="Plants" />
      <NavItem tab={AppTab.PROFILE} icon="fa-user" label="Profile" />
    </nav>
  );
};

export default BottomNav;
