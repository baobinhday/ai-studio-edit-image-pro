
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onExport: () => void;
  canExport: boolean;
  loading: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  isKeySet: boolean;
}

const Header: React.FC<HeaderProps> = ({
  undo, redo, canUndo, canRedo,
  mode, onModeChange, onExport, canExport, loading,
  onToggleLeftSidebar, onToggleRightSidebar, isKeySet
}) => {
  return (
    <header className="border-b border-slate-800 px-4 md:px-6 py-3 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onToggleLeftSidebar} className="lg:hidden p-2 text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">L</div>
          <h1 className="text-lg font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">LUMINA</h1>
        </div>
        <div className="hidden sm:flex gap-1 px-3 py-1 bg-slate-800/40 rounded-full border border-slate-700/50">
          <button onClick={undo} disabled={!canUndo || loading} className={`p-1.5 rounded-full hover:bg-slate-700 ${!canUndo ? 'text-slate-600' : 'text-slate-200'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg></button>
          <button onClick={redo} disabled={!canRedo || loading} className={`p-1.5 rounded-full hover:bg-slate-700 ${!canRedo ? 'text-slate-600' : 'text-slate-200'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path></svg></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-1 p-1 bg-slate-800/40 rounded-full border border-slate-700/50">
          <button onClick={() => onModeChange(AppMode.EDIT)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${mode === AppMode.EDIT ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>EDIT</button>
          <button onClick={() => onModeChange(AppMode.GENERATE)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${mode === AppMode.GENERATE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>GENERATE</button>
        </div>

        <button onClick={onExport} disabled={!canExport || loading} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border ${canExport ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'text-slate-700 border-slate-800'}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span className="hidden sm:inline">EXPORT</span>
        </button>

        <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black tracking-widest flex items-center gap-2 ${isKeySet ? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-400' : 'bg-amber-900/20 border-amber-500/50 text-amber-400'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isKeySet ? 'bg-indigo-400 animate-pulse' : 'bg-amber-400'}`}></div>
          {isKeySet ? 'ACTIVE' : 'NO KEY'}
        </div>

        <button onClick={onToggleRightSidebar} className="xl:hidden p-2 text-slate-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
      </div>
    </header>
  );
};

export default Header;
