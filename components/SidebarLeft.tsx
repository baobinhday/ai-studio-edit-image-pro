import React from "react";
import {
  AppMode,
  AspectRatio,
  GeminiModel,
  ImageSize,
  PREDEFINED_FILTERS,
} from "../types";

interface SidebarLeftProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyInput: string;
  onApiKeyChange: (val: string) => void;
  activeModel: GeminiModel;
  onModelChange: (model: GeminiModel) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReferenceUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  referenceImage: string | null;
  onClearReference: () => void;
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
}

const SidebarLeft: React.FC<SidebarLeftProps> = ({
  isOpen,
  onClose,
  apiKeyInput,
  onApiKeyChange,
  activeModel,
  onModelChange,
  onImageUpload,
  onReferenceUpload,
  referenceImage,
  onClearReference,
  imageUrlInput,
  onUrlInputChange,
  onUrlSubmit,
  activeImageSize,
  onImageSizeChange,
  activeAspectRatio,
  onAspectRatioChange,
  mode,
  brushSize,
  onBrushSizeChange,
  prompt,
  onPromptChange,
  loading,
  error,
  onAction,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-80 z-[60] bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* API Authentication */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">
            Authentication
          </h2>
          <input
            type="password"
            placeholder="Gemini API Key..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={apiKeyInput}
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
        </section>

        {/* Input Controls */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">
            Input Source
          </h2>
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group">
              <svg
                className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p className="text-[9px] text-slate-500 font-bold uppercase">
                Upload Image
              </p>
              <input
                id="source-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageUpload}
              />
            </label>
            <form onSubmit={onUrlSubmit} className="relative">
              <input
                type="url"
                placeholder="Paste Image URL..."
                className="bg-slate-800/50 border border-slate-700 text-xs rounded-xl block w-full p-2.5 focus:ring-indigo-500 transition-all text-slate-200 outline-none"
                value={imageUrlInput}
                onChange={(e) => onUrlInputChange(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </section>

        {/* Style Reference Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Style Reference
            </h2>
            {referenceImage && (
              <button
                onClick={onClearReference}
                className="text-[8px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            {!referenceImage ? (
              <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group">
                <svg
                  className="w-6 h-6 text-slate-600 group-hover:text-indigo-500 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <p className="text-[9px] text-slate-500 font-bold uppercase">
                  Add Subject/Style
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onReferenceUpload}
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] group">
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="w-full h-20 object-cover"
                />
                <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-transparent transition-colors"></div>
              </div>
            )}
          </div>
        </section>

        {/* Configurations */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Settings
          </h2>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
              Engine
            </label>
            <select
              value={activeModel}
              onChange={(e) => onModelChange(e.target.value as GeminiModel)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer outline-none"
            >
              <option value={GeminiModel.FLASH_2_5}>Gemini 2.5 Flash</option>
              <option value={GeminiModel.PRO_3}>Gemini 3 Pro (HQ)</option>
            </select>
          </div>

          {activeModel === GeminiModel.PRO_3 && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                Resolution
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {["1K", "2K", "4K"].map((size) => (
                  <button
                    key={size}
                    onClick={() => onImageSizeChange(size as ImageSize)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                      activeImageSize === size
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {["1:1", "16:9", "9:16", "4:3", "3:4"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => onAspectRatioChange(ratio as AspectRatio)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    activeAspectRatio === ratio
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {mode === AppMode.EDIT && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Brush Size
                </label>
                <span className="text-[10px] text-indigo-400">
                  {brushSize}px
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 accent-indigo-500 appearance-none cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PREDEFINED_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onPromptChange(filter.prompt)}
                  className="flex flex-col items-center gap-1 p-2 bg-slate-800/40 border border-slate-700 rounded-xl hover:border-indigo-500 transition-all text-center"
                >
                  <span className="text-sm">{filter.icon}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">
                    {filter.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Action Area */}
        <section className="mt-auto pt-6 border-t border-slate-800">
          <textarea
            placeholder={
              mode === AppMode.EDIT
                ? "Describe changes to the selected area..."
                : "Describe an image to generate..."
            }
            className="w-full h-24 bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 text-slate-200 resize-none mb-3 outline-none"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
          />
          {error && (
            <div className="break-words text-red-400 text-[9px] mb-3 p-2 bg-red-900/20 border border-red-900/30 rounded-xl leading-relaxed">
              {error}
            </div>
          )}
          <button
            onClick={onAction}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              loading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing
              </div>
            ) : (
              "Run Synthesis"
            )}
          </button>
        </section>
      </aside>
    </>
  );
};

export default SidebarLeft;
