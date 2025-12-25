
import React from 'react';
import { GeneratedImage } from '../types';

interface SidebarRightProps {
  history: GeneratedImage[];
  onHistoryItemClick: (url: string) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ history, onHistoryItemClick }) => {
  return (
    <aside className="w-64 border-l border-slate-800 p-6 bg-slate-900/40 overflow-y-auto hidden xl:flex flex-col">
      <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Master Library</h2>
      <div className="flex flex-col gap-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-indigo-500/50 transition-all bg-slate-950"
              onClick={() => onHistoryItemClick(item.url)}
            >
              <img src={item.url} alt={item.prompt} className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
                <p className="text-[9px] text-white line-clamp-2 italic font-medium leading-relaxed uppercase tracking-wider">"{item.prompt}"</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border border-slate-800 border-dashed rounded-2xl bg-slate-900/20">
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest text-center px-4">Workspace Empty</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarRight;
