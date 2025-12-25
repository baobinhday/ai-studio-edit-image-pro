
import React from 'react';
import { GeminiModel } from '../types';

interface FooterProps {
  isKeySet: boolean;
  historyLength: number;
  activeModel: GeminiModel;
}

const Footer: React.FC<FooterProps> = ({ isKeySet, historyLength, activeModel }) => {
  return (
    <footer className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-[9px] text-slate-600 flex justify-between items-center font-bold uppercase tracking-[0.2em]">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isKeySet ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}></span>
          {isKeySet ? 'API Key Active' : 'Key Missing'}
        </span>
        <span className="opacity-20">|</span>
        <span>History: <span className="text-slate-400">{historyLength}</span></span>
      </div>
      <div className="flex gap-6">
        <span>Model: <span className="text-slate-400">{activeModel === GeminiModel.FLASH_2_5 ? 'FLASH 2.5' : 'PRO 3'}</span></span>
        <span className="opacity-20">© 2024 STUDIO LUMINA</span>
      </div>
    </footer>
  );
};

export default Footer;
