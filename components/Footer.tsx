
import React from 'react';
import { GeminiModel } from '../types';

interface FooterProps {
  isLoggedIn: boolean;
  historyLength: number;
  activeModel: GeminiModel;
}

const Footer: React.FC<FooterProps> = ({ isLoggedIn, historyLength, activeModel }) => {
  return (
    <footer className="px-6 py-2.5 bg-slate-900 border-t border-slate-800 text-[9px] text-slate-600 flex justify-between items-center font-bold uppercase tracking-widest">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-indigo-500' : 'bg-slate-800'}`}></span>
          {isLoggedIn ? 'API Active' : 'No Key Selected'}
        </span>
        <span className="opacity-20">|</span>
        <span>Frames: <span className="text-indigo-500">{historyLength}</span></span>
      </div>
      <div className="flex gap-6">
        <span className="hidden sm:inline">Engine: {activeModel === GeminiModel.FLASH_2_5 ? 'Flash 2.5' : 'Pro 3'}</span>
        <a href="https://ai.google.dev/pricing" target="_blank" className="hover:text-indigo-400 transition-colors">Tier Details</a>
      </div>
    </footer>
  );
};

export default Footer;
