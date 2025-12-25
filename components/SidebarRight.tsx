
import React from 'react';
import { GeneratedImage } from '../types';

interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedImage[];
  onHistoryItemClick: (url: string) => void;
}

const SidebarRight: React.FC<SidebarRightProps> = ({ isOpen, onClose, history, onHistoryItemClick }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] xl:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 right-0 w-64 z-[60] bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto transition-transform duration-300 ease-in-out
        xl:static xl:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center xl:hidden mb-6">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">History</h2>
          <button onClick={onClose} className="p-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <h2 className="hidden xl:block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Master Library</h2>
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
    </>
  );
};

export default SidebarRight;
