import React, { useState, useEffect } from "react";
import {
  AppMode,
  DrawTool,
  EditorState,
  GeneratedImage,
  GeminiModel,
} from "./types";
import {
  editImageWithGemini,
  generateImageWithGemini,
} from "./services/geminiService";
import Header from "./components/Header";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import EditorViewport from "./components/EditorViewport";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

const STORAGE_KEY = "lumina_password";

const App: React.FC = () => {
  const [isKeySet, setIsKeySet] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [state, setState] = useState<EditorState>(() => {
    // Initialize with password from localStorage
    const savedPassword =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY) || ""
        : "";
    return {
      image: null,
      mask: null,
      referenceImage: null,
      apiKeyInput: "",
      passwordInput: savedPassword,
      prompt: "",
      loading: false,
      error: null,
      history: [],
      imageHistory: [],
      historyIndex: -1,
      activeAspectRatio: "1:1",
      activeImageSize: "1K",
      activeModel: GeminiModel.FLASH_2_5,
      mode: AppMode.EDIT,
      activeTool: DrawTool.NONE,
      brushColor: "#FF5733",
    };
  });

  const [brushSize, setBrushSize] = useState(30);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const isLoggedIn = !!state.passwordInput;

  useEffect(() => {
    setIsKeySet(
      !!(state.apiKeyInput || state.passwordInput || process.env.GEMINI_API_KEY)
    );
  }, [state.apiKeyInput, state.passwordInput]);

  const handleLogin = (password: string) => {
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, password);
    setState((prev) => ({ ...prev, passwordInput: password }));
    setLoginError(null);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState((prev) => ({ ...prev, passwordInput: "" }));
  };

  const handleAction = async (forcedPrompt?: string) => {
    const finalPrompt = forcedPrompt || state.prompt;
    if (!finalPrompt.trim()) {
      setState((prev) => ({ ...prev, error: "Please enter a prompt." }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    setIsLeftSidebarOpen(false);

    try {
      let resultUrl = "";
      if (state.mode === AppMode.EDIT && state.image) {
        resultUrl = await editImageWithGemini(
          state.activeModel,
          state.image,
          finalPrompt,
          state.activeAspectRatio,
          state.apiKeyInput,
          state.passwordInput,
          state.mask || undefined,
          state.referenceImage || undefined
        );
      } else {
        resultUrl = await generateImageWithGemini(
          state.activeModel,
          finalPrompt,
          state.activeAspectRatio,
          state.apiKeyInput,
          state.passwordInput,
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

      setState((prev) => ({
        ...prev,
        loading: false,
        mask: null,
        history: [newHistoryItem, ...prev.history],
      }));
      pushToHistory(resultUrl);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Synthesis failed.",
      }));
    }
  };

  const pushToHistory = (imageUrl: string) => {
    setState((prev) => {
      const newHistory = prev.imageHistory.slice(0, prev.historyIndex + 1);
      newHistory.push(imageUrl);
      return {
        ...prev,
        image: imageUrl,
        imageHistory: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  };

  const undo = () => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      setState((prev) => ({
        ...prev,
        historyIndex: newIndex,
        image: prev.imageHistory[newIndex],
        mask: null,
      }));
    }
  };

  const redo = () => {
    if (state.historyIndex < state.imageHistory.length - 1) {
      const newIndex = state.historyIndex + 1;
      setState((prev) => ({
        ...prev,
        historyIndex: newIndex,
        image: prev.imageHistory[newIndex],
        mask: null,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState((prev) => ({ ...prev, mode: AppMode.EDIT, error: null }));
        pushToHistory(event.target?.result as string);
        setIsLeftSidebarOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setState((prev) => ({ ...prev, mode: AppMode.EDIT, error: null }));
      pushToHistory(imageUrlInput);
      setImageUrlInput("");
      setIsLeftSidebarOpen(false);
    }
  };

  // Image transformation functions
  const rotateImage = (degrees: number) => {
    if (!state.image) return;
    const img = new Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const radians = (degrees * Math.PI) / 180;

      if (degrees === 90 || degrees === -90 || degrees === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedUrl = canvas.toDataURL("image/png");
      pushToHistory(rotatedUrl);
    };
  };

  const flipImage = (direction: "horizontal" | "vertical") => {
    if (!state.image) return;
    const img = new Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      if (direction === "horizontal") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }

      ctx.drawImage(img, 0, 0);
      const flippedUrl = canvas.toDataURL("image/png");
      pushToHistory(flippedUrl);
    };
  };

  const resizeImage = (newWidth: number, newHeight: number) => {
    if (!state.image || newWidth <= 0 || newHeight <= 0) return;
    const img = new Image();
    img.src = state.image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const resizedUrl = canvas.toDataURL("image/png");
      pushToHistory(resizedUrl);
    };
  };

  const cropImage = (
    x: number,
    y: number,
    cropWidth: number,
    cropHeight: number
  ) => {
    if (!state.image || cropWidth <= 0 || cropHeight <= 0) return;
    const img = new Image();
    img.src = state.image;
    img.onload = () => {
      // Scale coordinates back to original image size
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        x,
        y,
        cropWidth,
        cropHeight, // Source rectangle
        0,
        0,
        cropWidth,
        cropHeight // Destination rectangle
      );
      const croppedUrl = canvas.toDataURL("image/png");
      pushToHistory(croppedUrl);
    };
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <Header
        undo={undo}
        redo={redo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.imageHistory.length - 1}
        mode={state.mode}
        onModeChange={(mode) =>
          setState((prev) => ({ ...prev, mode, error: null }))
        }
        onExport={() => {
          if (!state.image) return;
          const link = document.createElement("a");
          link.href = state.image;
          link.download = `lumina-${Date.now()}.png`;
          link.click();
        }}
        canExport={!!state.image}
        loading={state.loading}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isKeySet={isKeySet}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <SidebarLeft
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          apiKeyInput={state.apiKeyInput}
          onApiKeyChange={(val) =>
            setState((prev) => ({ ...prev, apiKeyInput: val }))
          }
          activeModel={state.activeModel}
          onModelChange={(model) =>
            setState((prev) => ({ ...prev, activeModel: model }))
          }
          onImageUpload={handleImageUpload}
          onReferenceUpload={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const r = new FileReader();
              r.onload = (ev) =>
                setState((prev) => ({
                  ...prev,
                  referenceImage: ev.target?.result as string,
                }));
              r.readAsDataURL(file);
            }
          }}
          referenceImage={state.referenceImage}
          onClearReference={() =>
            setState((prev) => ({ ...prev, referenceImage: null }))
          }
          imageUrlInput={imageUrlInput}
          onUrlInputChange={setImageUrlInput}
          onUrlSubmit={handleUrlSubmit}
          activeImageSize={state.activeImageSize}
          onImageSizeChange={(size) =>
            setState((prev) => ({ ...prev, activeImageSize: size }))
          }
          activeAspectRatio={state.activeAspectRatio}
          onAspectRatioChange={(ratio) =>
            setState((prev) => ({ ...prev, activeAspectRatio: ratio }))
          }
          mode={state.mode}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          activeTool={state.activeTool}
          onToolChange={(tool) =>
            setState((prev) => ({ ...prev, activeTool: tool }))
          }
          brushColor={state.brushColor}
          onBrushColorChange={(color) =>
            setState((prev) => ({ ...prev, brushColor: color }))
          }
          prompt={state.prompt}
          onPromptChange={(prompt) => setState((prev) => ({ ...prev, prompt }))}
          loading={state.loading}
          error={state.error}
          onAction={() => handleAction()}
          onRotate={rotateImage}
          onFlip={flipImage}
          onResize={resizeImage}
        />

        <EditorViewport
          image={state.image}
          mode={state.mode}
          onMaskChange={(mask) => setState((prev) => ({ ...prev, mask }))}
          onCrop={cropImage}
          brushSize={brushSize}
          brushColor={state.brushColor}
          activeTool={state.activeTool}
          zoomScale={zoomScale}
          onZoomIn={() => setZoomScale((s) => Math.min(s + 0.2, 3))}
          onZoomOut={() => setZoomScale((s) => Math.max(s - 0.2, 0.5))}
          onResetZoom={() => setZoomScale(1.0)}
          onUploadClick={() =>
            document.querySelector<HTMLInputElement>("#source-upload")?.click()
          }
          onGenerateClick={() =>
            setState((prev) => ({ ...prev, mode: AppMode.GENERATE }))
          }
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

      <Footer
        isKeySet={isKeySet}
        historyLength={state.imageHistory.length}
        activeModel={state.activeModel}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        error={loginError}
      />
    </div>
  );
};

export default App;
