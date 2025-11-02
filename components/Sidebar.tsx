import React from 'react';
import { View } from '../types';

const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="3" x2="21" y1="15" y2="15"></line><line x1="9" x2="9" y1="3" y2="21"></line><line x1="15" x2="15" y1="3" y2="21"></line></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>;
const CheckSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 14v-2m-7.5 5.5 1-1m-4-11.5 1-1m10 3 1-1m-10 8 1-1m-7-1-1-1m16 0-1-1m-4 1-1-1m-3-11 1-1m-4 4 1-1m1-4L4 4m3 1 1-1m10 10 3 3m-3-11 3 3m-1-1 1-1"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const UserCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const ClapperboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 9.5 16 14"/><path d="m3.5 3.5 14 14"/><path d="M11 2 2 11v11h11l9-9Z"/><path d="m15.5 18.5-10-10"/></svg>;
const FilmstripIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line><line x1="17" y1="17" x2="22" y2="17"></line></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><path d="M8.12 8.12 12 12"></path><path d="M20 4 8.12 15.88"></path><circle cx="6" cy="18" r="3"></circle><path d="M14.88 14.88 20 20"></path></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const BrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9 2 22l5.5-1.5L21.16 6.84a2.2 2.2 0 0 0-3.12-3.12L6.1 17.5Z"/><path d="m16 5 5 5"/></svg>;
const PaletteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.422-.02-.833-.052-1.222h.002c.03-.389.052-.79.052-1.222 0-.921.746-1.667 1.667-1.667h1.222c.389 0 .79-.02 1.222-.052v.002c.422-.03.833-.052 1.222-.052 1.667 0 1.667-1.648 1.667-1.648S22 8.167 22 6.5C22 4.5 20 2 18 2c-1 0-1.5.5-2 1s-1 1-2 1-1.5-.5-2-1-.5-1-1.5-1Z"/></svg>;
const FilmReelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"></rect><line x1="7" x2="7" y1="2" y2="22"></line><line x1="17" x2="17" y1="2" y2="22"></line><line x1="2" x2="22" y1="12" y2="12"></line><line x1="2" x2="7" y1="7" y2="7"></line><line x1="2" x2="7" y1="17" y2="17"></line><line x1="17" x2="22" y1="7" y2="7"></line><line x1="17" x2="22" y1="17" y2="17"></line></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="3" x2="21" y1="15" y2="15"></line><line x1="9" x2="9" y1="3" y2="21"></line><line x1="15" x2="15" y1="3" y2="21"></line></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 6h3v12h-3"/><path d="M12 6h3v12h-3"/><path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3Z"/><path d="M2 12h6"/></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a3 3 0 0 1 0-6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>;
const LineChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const CropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg>;


interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const mainItem = { view: View.DIRECTOR_DASHBOARD, icon: <HomeIcon />, label: View.DIRECTOR_DASHBOARD };

const managementItems = [
  { view: View.PRODUCTION_OFFICE, icon: <BriefcaseIcon />, label: View.PRODUCTION_OFFICE },
]

const analysisItems = [
    { view: View.TOOLS_HUB, icon: <GridIcon />, label: View.TOOLS_HUB },
    { view: View.EMOTIONAL_ARCHITECTURE, icon: <HeartIcon />, label: View.EMOTIONAL_ARCHITECTURE },
    { view: View.VISUAL_STORYTELLING, icon: <CameraIcon />, label: View.VISUAL_STORYTELLING },
    { view: View.PACING_RHYTHM, icon: <ZapIcon />, label: View.PACING_RHYTHM },
    { view: View.SCRIPT_ANALYSIS, icon: <FileTextIcon />, label: View.SCRIPT_ANALYSIS },
    { view: View.CONTINUITY_CHECKER, icon: <CheckSquareIcon />, label: View.CONTINUITY_CHECKER },
    { view: View.DOCUMENT_MANAGER, icon: <FolderIcon />, label: View.DOCUMENT_MANAGER },
    { view: View.EMOTIONAL_ARC_VISUALIZER, icon: <LineChartIcon />, label: View.EMOTIONAL_ARC_VISUALIZER },
    { view: View.PACING_VISUALIZER, icon: <BarChartIcon />, label: View.PACING_VISUALIZER },
];

const preproductionItems = [
  { view: View.SCRIPT_BREAKDOWN, icon: <WandIcon />, label: View.SCRIPT_BREAKDOWN },
  { view: View.LOOK_DEV_LAB, icon: <BrushIcon />, label: View.LOOK_DEV_LAB },
  { view: View.AI_CASTING_STUDIO, icon: <UsersIcon />, label: View.AI_CASTING_STUDIO },
  { view: View.CORPUS_ASSISTANT, icon: <MessageSquareIcon />, label: View.CORPUS_ASSISTANT },
];

const productionItems = [
  { view: View.SHOT_DATABASE, icon: <DatabaseIcon />, label: View.SHOT_DATABASE },
  { view: View.CANONICAL_ASSETS, icon: <UserCheckIcon />, label: View.CANONICAL_ASSETS },
  { view: View.STORYBOARD_GENERATOR, icon: <ClapperboardIcon />, label: View.STORYBOARD_GENERATOR },
  { view: View.VIDEO_GENERATOR, icon: <FilmstripIcon />, label: View.VIDEO_GENERATOR },
]

const qualityControlItems = [
    { view: View.SHOT_COMPOSITION_VALIDATOR, icon: <CropIcon />, label: View.SHOT_COMPOSITION_VALIDATOR },
];

const postproductionItems = [
  { view: View.AUDIO_PRODUCTION, icon: <MicIcon />, label: View.AUDIO_PRODUCTION },
  { view: View.COLOR_VFX_HUB, icon: <PaletteIcon />, label: View.COLOR_VFX_HUB },
  { view: View.EDIT_BAY, icon: <ScissorsIcon />, label: View.EDIT_BAY },
]

const marketingItems = [
    { view: View.TRAILER_GENERATOR, icon: <TicketIcon />, label: View.TRAILER_GENERATOR },
];

const libraryItems = [
  { view: View.ASSET_LIBRARY, icon: <LibraryIcon />, label: View.ASSET_LIBRARY },
]

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

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="w-16 md:w-64 bg-vanguard-bg-secondary flex flex-col border-r border-vanguard-bg-tertiary">
      <div className="flex items-center justify-center md:justify-start md:pl-4 h-20 border-b border-vanguard-bg-tertiary">
        <FilmReelIcon />
        <h1 className="hidden md:block ml-2 text-lg font-bold text-vanguard-accent">VANGUARD AI</h1>
      </div>
      <ul className="flex-1 flex flex-col items-center md:items-stretch py-4 space-y-1 overflow-y-auto">
        <NavButton item={mainItem} currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Management</h2>
        </div>
        {managementItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Analysis</h2>
        </div>
        {analysisItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Pre-Production</h2>
        </div>
        {preproductionItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

         <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Production</h2>
        </div>
         {productionItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Quality Control</h2>
        </div>
        {qualityControlItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
        
        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Post-Production</h2>
        </div>
         {postproductionItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Marketing</h2>
        </div>
         {marketingItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}

        <div className="px-4 pt-4 pb-2 hidden md:block">
          <h2 className="text-xs font-semibold text-vanguard-text-secondary uppercase tracking-wider">Library</h2>
        </div>
         {libraryItems.map((item) => (
          <NavButton key={item.view} item={item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
      </ul>
      <div className="p-4 border-t border-vanguard-bg-tertiary text-center text-xs text-vanguard-text-secondary">
          <p className="hidden md:block">Version 8.0.0</p>
          <p className="hidden md:block">Autonomous Studio</p>
      </div>
    </nav>
  );
};

export default Sidebar;