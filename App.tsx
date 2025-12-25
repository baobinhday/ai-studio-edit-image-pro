
import React, { useState, useEffect } from 'react';
import { AppMode, AspectRatio, EditorState, GeneratedImage, GeminiModel, ImageSize } from './types';
import { editImageWithGemini, generateImageWithGemini } from './services/geminiService';
import Header from './components/Header';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import EditorViewport from './components/EditorViewport';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    image: null,
    mask: null,
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

  const [brushSize, setBrushSize] = useState(20);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const aistudio = (window as any).aistudio;
        if (aistudio) {
          const hasKey = await aistudio.hasSelectedApiKey();
          setIsLoggedIn(hasKey);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        await aistudio.openSelectKey();
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAction = async (forcedPrompt?: string) => {
    if (!isLoggedIn) {
      await handleLogin();
      return;
    }

    const finalPrompt = forcedPrompt || state.prompt;
    if (!finalPrompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a prompt or select a style." }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let resultUrl = '';
      if (state.mode === AppMode.EDIT && state.image) {
        resultUrl = await editImageWithGemini(state.activeModel, state.image, finalPrompt, state.mask || undefined);
      } else {
        resultUrl = await generateImageWithGemini(state.activeModel, finalPrompt, state.activeAspectRatio, state.activeImageSize);
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
      let message = err.message || "An unexpected error occurred.";
      const errorStr = JSON.stringify(err).toLowerCase();
      
      if (errorStr.includes("permission_denied") || errorStr.includes("403") || message.includes("permission")) {
        message = "Permission Denied: Gemini 3 Pro requires a Paid Billing Project in Google Cloud. Please switch to Gemini 2.5 Flash for Free Tier access or upgrade your account.";
      } else if (message.includes("Requested entity was not found")) {
        message = "Model not found: The selected model is unavailable for your current API key. Try switching to Gemini 2.5 Flash.";
      }
      
      setState(prev => ({ ...prev, loading: false, error: message }));
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
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        image: prev.imageHistory[newIndex],
        mask: null 
      }));
    }
  };

  const redo = () => {
    if (state.historyIndex < state.imageHistory.length - 1) {
      const newIndex = state.historyIndex + 1;
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        image: prev.imageHistory[newIndex],
        mask: null
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setState(prev => ({ ...prev, mode: AppMode.EDIT }));
        pushToHistory(url);
        setZoomScale(1.0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setState(prev => ({ ...prev, mode: AppMode.EDIT }));
      pushToHistory(imageUrlInput);
      setImageUrlInput('');
      setZoomScale(1.0);
    }
  };

  const handleExport = () => {
    if (!state.image) return;
    const link = document.createElement('a');
    link.href = state.image;
    link.download = `lumina-studio-export-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header 
        undo={undo}
        redo={redo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.imageHistory.length - 1}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        mode={state.mode}
        onModeChange={(mode) => setState(prev => ({ ...prev, mode, error: null }))}
        onExport={handleExport}
        canExport={!!state.image}
        loading={state.loading}
      />

      <main className="flex-1 flex overflow-hidden">
        <SidebarLeft 
          activeModel={state.activeModel}
          onModelChange={(model) => setState(prev => ({ ...prev, activeModel: model, error: null }))}
          onImageUpload={handleImageUpload}
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
          isLoggedIn={isLoggedIn}
        />

        <EditorViewport 
          image={state.image}
          mode={state.mode}
          onMaskChange={(mask) => setState(prev => ({ ...prev, mask }))}
          brushSize={brushSize}
          zoomScale={zoomScale}
          onZoomIn={() => setZoomScale(s => Math.min(s + 0.25, 4.0))}
          onZoomOut={() => setZoomScale(s => Math.max(s - 0.25, 0.25))}
          onResetZoom={() => setZoomScale(1.0)}
          onUploadClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          onGenerateClick={() => setState(prev => ({ ...prev, mode: AppMode.GENERATE }))}
        />

        <SidebarRight 
          history={state.history}
          onHistoryItemClick={(url) => {
            pushToHistory(url);
            setZoomScale(1.0);
          }}
        />
      </main>

      <Footer 
        isLoggedIn={isLoggedIn}
        historyLength={state.imageHistory.length}
        activeModel={state.activeModel}
      />
    </div>
  );
};

export default App;
