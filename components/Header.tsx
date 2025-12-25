
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onExport: () => void;
  canExport: boolean;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  undo, redo, canUndo, canRedo,
  isLoggedIn, onLogin, onLogout,
  mode, onModeChange, onExport, canExport, loading
}) => {
  return (
    <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold shadow-indigo-500/20 shadow-lg">L</div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Lumina Studio</h1>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-800/40 rounded-full border border-slate-700/50">
          <button 
            onClick={undo}
            disabled={!canUndo || loading}
            className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${!canUndo ? 'text-slate-600 cursor-not-allowed' : 'text-slate-200'}`}
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
          </button>
          <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
          <button 
            onClick={redo}
            disabled={!canRedo || loading}
            className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${!canRedo ? 'text-slate-600 cursor-not-allowed' : 'text-slate-200'}`}
            title="Redo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"></path></svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={onLogin}
            className="flex items-center gap-2 px-5 py-2 bg-white text-slate-950 rounded-full text-xs font-bold hover:bg-slate-200 transition-all shadow-xl active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            Sign In
          </button>
        )}

        <div className="w-px h-6 bg-slate-800 mx-1"></div>

        <div className="flex items-center gap-1 p-1 bg-slate-800/40 rounded-full border border-slate-700/50">
          <button 
            onClick={() => onModeChange(AppMode.EDIT)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === AppMode.EDIT ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            AI Edit
          </button>
          <button 
            onClick={() => onModeChange(AppMode.GENERATE)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === AppMode.GENERATE ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            AI Generate
          </button>
        </div>
        
        <button
          onClick={onExport}
          disabled={!canExport || loading}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${canExport ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-600/10' : 'bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
