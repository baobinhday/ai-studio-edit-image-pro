
import React, { useState, useEffect } from 'react';
import { AppMode, AspectRatio, EditorState, GeneratedImage, GeminiModel, ImageSize } from './types';
import { editImageWithGemini, generateImageWithGemini } from './services/geminiService';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import EditorViewport from './components/EditorViewport';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isKeySet, setIsKeySet] = useState(false);
  const [state, setState] = useState<EditorState>({
    image: null,
    mask: null,
    referenceImage: null,
    apiKeyInput: '',
    prompt: '',
    loading: false,
    error: null,
    history: [],
    imageHistory: [],
    historyIndex: -1,
    activeAspectRatio: '1:1',
    activeImageSize: '1K',
    activeModel: GeminiModel.FLASH_2_5,
    mode: AppMode.EDIT,
  });

  const [brushSize, setBrushSize] = useState(30);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    setIsKeySet(!!(state.apiKeyInput || process.env.API_KEY));
  }, [state.apiKeyInput]);

  const handleAction = async (forcedPrompt?: string) => {
    const finalPrompt = forcedPrompt || state.prompt;
    if (!finalPrompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a prompt." }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    setIsLeftSidebarOpen(false); 

    try {
      let resultUrl = '';
      if (state.mode === AppMode.EDIT && state.image) {
        resultUrl = await editImageWithGemini(
          state.activeModel, 
          state.image, 
          finalPrompt, 
          state.activeAspectRatio,
          state.apiKeyInput,
          state.mask || undefined,
          state.referenceImage || undefined
        );
      } else {
        resultUrl = await generateImageWithGemini(
          state.activeModel, 
          finalPrompt, 
          state.activeAspectRatio, 
          state.apiKeyInput,
          state.activeImageSize,
          state.referenceImage || undefined
        );
      }

      const newHistoryItem: GeneratedImage = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: finalPrompt,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        loading: false,
        mask: null,
        history: [newHistoryItem, ...prev.history],
      }));
      pushToHistory(resultUrl);
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message || "Synthesis failed." }));
    }
  };

  const pushToHistory = (imageUrl: string) => {
    setState(prev => {
      const newHistory = prev.imageHistory.slice(0, prev.historyIndex + 1);
      newHistory.push(imageUrl);
      return {
        ...prev,
        image: imageUrl,
        imageHistory: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  };

  const undo = () => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      setState(prev => ({ ...prev, historyIndex: newIndex, image: prev.imageHistory[newIndex], mask: null }));
    }
  };

  const redo = () => {
    if (state.historyIndex < state.imageHistory.length - 1) {
      const newIndex = state.historyIndex + 1;
      setState(prev => ({ ...prev, historyIndex: newIndex, image: prev.imageHistory[newIndex], mask: null }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({ ...prev, mode: AppMode.EDIT, error: null }));
        pushToHistory(event.target?.result as string);
        setIsLeftSidebarOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setState(prev => ({ ...prev, mode: AppMode.EDIT, error: null }));
      pushToHistory(imageUrlInput);
      setImageUrlInput('');
      setIsLeftSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <Header 
        undo={undo}
        redo={redo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.imageHistory.length - 1}
        mode={state.mode}
        onModeChange={(mode) => setState(prev => ({ ...prev, mode, error: null }))}
        onExport={() => {
          if (!state.image) return;
          const link = document.createElement('a');
          link.href = state.image;
          link.download = `lumina-${Date.now()}.png`;
          link.click();
        }}
        canExport={!!state.image}
        loading={state.loading}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isKeySet={isKeySet}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <SidebarLeft 
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          apiKeyInput={state.apiKeyInput}
          onApiKeyChange={(val) => setState(prev => ({ ...prev, apiKeyInput: val }))}
          activeModel={state.activeModel}
          onModelChange={(model) => setState(prev => ({ ...prev, activeModel: model }))}
          onImageUpload={handleImageUpload}
          onReferenceUpload={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const r = new FileReader();
              r.onload = (ev) => setState(prev => ({ ...prev, referenceImage: ev.target?.result as string }));
              r.readAsDataURL(file);
            }
          }}
          referenceImage={state.referenceImage}
          onClearReference={() => setState(prev => ({ ...prev, referenceImage: null }))}
          imageUrlInput={imageUrlInput}
          onUrlInputChange={setImageUrlInput}
          onUrlSubmit={handleUrlSubmit}
          activeImageSize={state.activeImageSize}
          onImageSizeChange={(size) => setState(prev => ({ ...prev, activeImageSize: size }))}
          activeAspectRatio={state.activeAspectRatio}
          onAspectRatioChange={(ratio) => setState(prev => ({ ...prev, activeAspectRatio: ratio }))}
          mode={state.mode}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          prompt={state.prompt}
          onPromptChange={(prompt) => setState(prev => ({ ...prev, prompt }))}
          loading={state.loading}
          error={state.error}
          onAction={() => handleAction()}
        />

        <EditorViewport 
          image={state.image}
          mode={state.mode}
          onMaskChange={(mask) => setState(prev => ({ ...prev, mask }))}
          brushSize={brushSize}
          zoomScale={zoomScale}
          onZoomIn={() => setZoomScale(s => Math.min(s + 0.2, 3))}
          onZoomOut={() => setZoomScale(s => Math.max(s - 0.2, 0.5))}
          onResetZoom={() => setZoomScale(1.0)}
          onUploadClick={() => document.querySelector<HTMLInputElement>('#source-upload')?.click()}
          onGenerateClick={() => setState(prev => ({ ...prev, mode: AppMode.GENERATE }))}
        />

        <SidebarRight 
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          history={state.history}
          onHistoryItemClick={(url) => {
            pushToHistory(url);
            setIsRightSidebarOpen(false);
          }}
        />
      </main>

      <Footer isKeySet={isKeySet} historyLength={state.imageHistory.length} activeModel={state.activeModel} />
    </div>
  );
};

export default App;
