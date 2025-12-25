
import React from 'react';
import { AppMode } from '../types';
import DrawingCanvas from './DrawingCanvas';

interface EditorViewportProps {
  image: string | null;
  mode: AppMode;
  onMaskChange: (mask: string | null) => void;
  brushSize: number;
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onUploadClick: () => void;
  onGenerateClick: () => void;
}

const EditorViewport: React.FC<EditorViewportProps> = ({
  image, mode, onMaskChange, brushSize, zoomScale,
  onZoomIn, onZoomOut, onResetZoom,
  onUploadClick, onGenerateClick
}) => {
  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-950 overflow-auto relative custom-scrollbar">
      {image ? (
        <div className="min-w-full min-h-full flex items-center justify-center p-12">
          {mode === AppMode.EDIT ? (
            <DrawingCanvas 
              imageUrl={image} 
              onMaskChange={onMaskChange}
              brushSize={brushSize}
              zoomScale={zoomScale}
            />
          ) : (
            <div 
              className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-slate-800 transition-all duration-75"
              style={{ transform: `scale(${zoomScale})` }}
            >
               <img src={image} alt="Generated" className="object-contain max-w-full max-h-full" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-indigo-500/20 shadow-inner">
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Studio Lumina</h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-sm">Professional AI image suite. Toggle between the efficient Flash engine and the powerful Pro engine for high-res creative work.</p>
          <div className="flex gap-4">
            <button 
              onClick={onUploadClick}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-semibold text-sm transition-all shadow-lg"
            >
              Edit Local Photo
            </button>
            <button 
              onClick={onGenerateClick}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-sm transition-all shadow-xl shadow-indigo-600/20"
            >
              Generate from Prompt
            </button>
          </div>
        </div>
      )}

      {/* Floating Zoom Controls */}
      {image && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[1.25rem] shadow-2xl z-50">
          <button 
            onClick={onZoomOut}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
          </button>
          <div className="w-px h-4 bg-slate-800"></div>
          <button 
            onClick={onResetZoom}
            className="px-3 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[64px] transition-colors"
          >
            {Math.round(zoomScale * 100)}%
          </button>
          <div className="w-px h-4 bg-slate-800"></div>
          <button 
            onClick={onZoomIn}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorViewport;
