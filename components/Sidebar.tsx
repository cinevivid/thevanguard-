
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const FilmReelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect><line x1="7" x2="7" y1="2" y2="22"></line><line x1="17" x2="17" y1="2" y2="22"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="2" x2="7" y1="7" y2="7"></line><line x1="2" x2="7" y1="17" y2="17"></line><line x1="17" x2="22" y1="7" y2="7"></line><line x1="17" x2="22" y1="17" y2="17"></line></svg>
);
const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"></line><line x1="18" x2="18" y1="20" y2="4"></line><line x1="6" x2="6" y1="20" y2="16"></line></svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
);
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
);
const MessageSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const navItems = [
  { view: View.DASHBOARD, icon: <BarChartIcon />, label: View.DASHBOARD },
  { view: View.DOCUMENT_MANAGEMENT, icon: <FileTextIcon />, label: View.DOCUMENT_MANAGEMENT },
  { view: View.CORPUS_ASSISTANT, icon: <MessageSquareIcon />, label: View.CORPUS_ASSISTANT },
  { view: View.EMOTIONAL_ARCHITECTURE, icon: <BarChartIcon />, label: View.EMOTIONAL_ARCHITECTURE },
  { view: View.VISUAL_STORYTELLING, icon: <CameraIcon />, label: View.VISUAL_STORYTELLING },
  { view: View.PACING_RHYTHM, icon: <ClockIcon />, label: View.PACING_RHYTHM },
  { view: View.SCRIPT_ANALYSIS, icon: <BookOpenIcon />, label: View.SCRIPT_ANALYSIS },
  { view: View.CONTINUITY_CHECKER, icon: <SearchIcon />, label: View.CONTINUITY_CHECKER },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="w-16 md:w-64 bg-vanguard-bg-secondary flex flex-col border-r border-vanguard-bg-tertiary">
      <div className="flex items-center justify-center md:justify-start md:pl-4 h-20 border-b border-vanguard-bg-tertiary">
        <FilmReelIcon />
        <h1 className="hidden md:block ml-2 text-xl font-bold text-vanguard-accent">THE VANGUARD</h1>
      </div>
      <ul className="flex-1 flex flex-col items-center md:items-stretch py-4 space-y-2">
        {navItems.map((item) => (
          <li key={item.view}>
            <button
              onClick={() => setCurrentView(item.view)}
              className={`flex items-center justify-center md:justify-start py-3 md:px-4 w-full text-left transition-colors duration-200 ${
                currentView === item.view
                  ? 'bg-vanguard-accent text-white'
                  : 'text-vanguard-text-secondary hover:bg-vanguard-bg-tertiary hover:text-vanguard-text'
              }`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span className="hidden md:inline-block ml-4">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t border-vanguard-bg-tertiary text-center text-xs text-vanguard-text-secondary">
          <p className="hidden md:block">Version 1.0.0</p>
      </div>
    </nav>
  );
};

export default Sidebar;
