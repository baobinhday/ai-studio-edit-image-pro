
import React from 'react';
import { AppMode, AspectRatio, GeminiModel, ImageSize, PREDEFINED_FILTERS, StyleFilter } from '../types';

interface SidebarLeftProps {
  activeModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrlInput: string;
  onUrlInputChange: (url: string) => void;
  onUrlSubmit: (e: React.FormEvent) => void;
  activeImageSize: ImageSize;
  onImageSizeChange: (size: ImageSize) => void;
  activeAspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  mode: AppMode;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  loading: boolean;
  error: string | null;
  onAction: () => void;
  isLoggedIn: boolean;
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  activeModel, onModelChange,
  onImageUpload, imageUrlInput, onUrlInputChange, onUrlSubmit,
  activeImageSize, onImageSizeChange,
  activeAspectRatio, onAspectRatioChange,
  mode, brushSize, onBrushSizeChange,
  prompt, onPromptChange, loading, error, onAction, isLoggedIn
}) => {
  return (
    <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-900/40">
      <section>
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Core Engine</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onModelChange(GeminiModel.FLASH_2_5)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${activeModel === GeminiModel.FLASH_2_5 ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
          >
            <div className="text-left">
              <div className="text-xs font-bold">Gemini 2.5 Flash</div>
              <div className="text-[9px] opacity-60">Optimized / Free Tier</div>
            </div>
            {activeModel === GeminiModel.FLASH_2_5 && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
          </button>
          <button
            onClick={() => onModelChange(GeminiModel.PRO_3)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${activeModel === GeminiModel.PRO_3 ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
          >
            <div className="text-left">
              <div className="text-xs font-bold flex items-center gap-1.5">
                Gemini 3 Pro
                <span className="bg-amber-500 text-[8px] text-slate-950 px-1 rounded-sm">PAID</span>
              </div>
              <div className="text-[9px] opacity-60">High Fidelity / Ultra-Res</div>
            </div>
            {activeModel === GeminiModel.PRO_3 && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Input Source</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group">
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <svg className="w-6 h-6 mb-2 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <p className="text-[10px] text-slate-500 group-hover:text-slate-300">Upload Local File</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
          </label>
          
          <form onSubmit={onUrlSubmit}>
            <input 
              type="url" 
              placeholder="Paste direct image URL..." 
              className="bg-slate-800/50 border border-slate-700 text-xs rounded-lg block w-full p-2.5 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600 transition-all"
              value={imageUrlInput}
              onChange={(e) => onUrlInputChange(e.target.value)}
            />
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Configuration</h2>
        <div className="space-y-6">
          {activeModel === GeminiModel.PRO_3 && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {['1K', '2K', '4K'].map(size => (
                  <button
                    key={size}
                    onClick={() => onImageSizeChange(size as ImageSize)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${activeImageSize === size ? 'bg-indigo-600 border-indigo-400 shadow-md' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => onAspectRatioChange(ratio as AspectRatio)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${activeAspectRatio === ratio ? 'bg-indigo-600 border-indigo-400 shadow-md' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {mode === AppMode.EDIT && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brush Weight</label>
                <span className="text-[10px] font-mono text-indigo-400">{brushSize}px</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="100" 
                step="5"
                value={brushSize} 
                onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}
        </div>
      </section>

      {mode === AppMode.EDIT && (
         <section>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Styles Library</h2>
          <div className="grid grid-cols-2 gap-2">
            {PREDEFINED_FILTERS.map(style => (
              <button
                key={style.id}
                onClick={() => onPromptChange(style.prompt)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center group ${prompt === style.prompt ? 'bg-indigo-600/20 border-indigo-500 shadow-indigo-500/10 shadow-inner' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{style.icon}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{style.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-auto pt-4 border-t border-slate-800">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">AI Instruction</h2>
        <textarea 
          placeholder={mode === AppMode.EDIT ? "What should happen to the selected area?" : "Describe your vision in detail..."}
          className="w-full h-24 bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-600 resize-none mb-4 transition-all"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
        
        {error && <div className="text-red-400 text-[10px] mb-4 p-2 bg-red-900/20 border border-red-900/50 rounded flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <span className="font-bold">Error Encountered</span>
          </div>
          <p className="opacity-90 leading-tight">{error}</p>
          {error.includes("Gemini 3 Pro") && (
            <button 
              onClick={() => onModelChange(GeminiModel.FLASH_2_5)}
              className="mt-1 text-indigo-400 hover:text-indigo-300 underline text-left"
            >
              Switch to Free Tier (Flash 2.5)
            </button>
          )}
        </div>}
        
        <button
          onClick={onAction}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${loading ? 'bg-slate-800 cursor-not-allowed text-slate-500' : isLoggedIn ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white shadow-indigo-600/20' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Processing...</span>
            </>
          ) : isLoggedIn ? (
            mode === AppMode.EDIT ? 'Update Canvas' : 'Synthesize Image'
          ) : (
            'Sign in to use AI'
          )}
        </button>
      </section>
    </aside>
  );
};

export default SidebarLeft;
