import React from 'react';
import { View } from '../types';

// Icon components (as before)
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const BrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9 2 22l5.5-1.5L21.16 6.84a2.2 2.2 0 0 0-3.12-3.12L6.1 17.5Z"/><path d="m16 5 5 5"/></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><path d="M8.12 8.12 12 12"></path><path d="M20 4 8.12 15.88"></path><circle cx="6" cy="18" r="3"></circle><path d="M14.88 14.88 20 20"></path></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const CheckSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 6h3v12h-3"/><path d="M12 6h3v12h-3"/><path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3Z"/><path d="M2 12h6"/></svg>;
const FilmReelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect><line x1="7" x2="7" y1="2" y2="22"></line><line x1="17" x2="17" y1="2" y2="22"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="2" x2="7" y1="7" y2="7"></line><line x1="2" x2="7" y1="17" y2="17"></line><line x1="17" x2="22" y1="7" y2="7"></line><line x1="17" x2="22" y1="17" y2="17"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;


interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavButton: React.FC<{
  item: { view: View; icon: React.ReactElement; label: string };
  currentView: View;
  setCurrentView: (view: View) => void;
}> = ({ item, currentView, setCurrentView }) => (
   <li>
      <button
        onClick={() => setCurrentView(item.view)}
        className={`flex items-center justify-center md:justify-start py-3 md:px-4 w-full text-left transition-colors duration-200 ${
          currentView === item.view
            ? 'bg-vanguard-accent text-white'
            : 'text-vanguard-text-secondary hover:bg-vanguard-bg-tertiary hover:text-vanguard-text'
        }`}
      >
        <span className="w-6 h-6">{item.icon}</span>
        <span className="hidden md:inline-block ml-4 text-sm font-semibold">{item.label}</span>
      </button>
    </li>
);

const Section: React.FC<{ title: string; items: { view: View; icon: React.ReactElement; label: string }[]; currentView: View; setCurrentView: (view: View) => void }> = ({ title, items, currentView, setCurrentView }) => (
    <>
        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">{title}</h2>
        </div>
        {items.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
    </>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const sections = [
    { title: 'Direction & Management', items: [
      { view: View.DIRECTORS_ROOM, icon: <HomeIcon />, label: View.DIRECTORS_ROOM },
      { view: View.PRODUCTION_OFFICE, icon: <BriefcaseIcon />, label: View.PRODUCTION_OFFICE },
    ]},
    { title: "Writer's Room", items: [
      { view: View.WRITERS_ROOM, icon: <BookOpenIcon />, label: View.WRITERS_ROOM },
    ]},
    { title: 'Digital Art Dept.', items: [
      { view: View.ART_DEPT, icon: <BrushIcon />, label: View.ART_DEPT },
    ]},
    { title: 'Camera & Lighting', items: [
      { view: View.CAMERA_DEPT, icon: <CameraIcon />, label: View.CAMERA_DEPT },
    ]},
    { title: 'Post-Production', items: [
      { view: View.POST_PRODUCTION_SUITE, icon: <ScissorsIcon />, label: "Post-Production" },
    ]},
    { title: 'Production Data', items: [
      { view: View.SHOT_DATABASE, icon: <DatabaseIcon />, label: View.SHOT_DATABASE },
      { view: View.ASSET_LIBRARY, icon: <LibraryIcon />, label: View.ASSET_LIBRARY },
    ]},
    { title: 'Quality Control', items: [
      { view: View.CONTINUITY_VERIFIER, icon: <CheckSquareIcon />, label: View.CONTINUITY_VERIFIER },
      { view: View.PRODUCTION_AUDIT, icon: <SearchIcon />, label: View.PRODUCTION_AUDIT },
    ]},
    { title: 'System', items: [
      { view: View.API_KEYS, icon: <SettingsIcon />, label: View.API_KEYS },
    ]}
  ];

  return (
    <nav className="w-16 md:w-64 bg-vanguard-bg-secondary flex flex-col border-r border-vanguard-bg-tertiary">
      <div className="flex items-center justify-center md:justify-start md:pl-4 h-20 border-b border-vanguard-bg-tertiary">
        <FilmReelIcon />
        <h1 className="hidden md:block ml-2 text-lg font-bold text-vanguard-accent">VANGUARD AI</h1>
      </div>
      <ul className="flex-1 flex flex-col items-center md:items-stretch py-4 space-y-1 overflow-y-auto">
        {sections.map(section => (
            <Section key={section.title} {...section} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
      </ul>
      <div className="p-4 border-t border-vanguard-bg-tertiary text-center text-xs text-vanguard-text-secondary">
          <p className="hidden md:block">Version 12.0</p>
          <p className="hidden md:block">Firebase Integrated</p>
      </div>
    </nav>
  );
};

export default Sidebar;