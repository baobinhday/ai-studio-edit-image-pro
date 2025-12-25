
import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  imageUrl: string;
  onMaskChange: (maskBase64: string | null) => void;
  brushSize: number;
  zoomScale: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ imageUrl, onMaskChange, brushSize, zoomScale }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Calculate max available space
      // On small screens, sidebars are hidden/overlays, so use more width
      const isMobile = window.innerWidth < 1024;
      const horizontalPadding = isMobile ? 40 : 120;
      const verticalPadding = isMobile ? 180 : 200;
      
      const maxWidth = window.innerWidth - (isMobile ? 0 : 320 + 256) - horizontalPadding;
      const maxHeight = window.innerHeight - verticalPadding;
      
      let width = img.width;
      let height = img.height;
      
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
      
      setBaseSize({ width, height });
    };
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = maskCanvasRef.current;
    if (canvas) {
      onMaskChange(canvas.toDataURL('image/png'));
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !maskCanvasRef.current) return;
    
    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) / (rect.width / canvas.width);
    const y = (clientY - rect.top) / (rect.height / canvas.height);

    ctx.fillStyle = 'red';
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onMaskChange(null);
    }
  };

  if (baseSize.width === 0) return <div className="animate-pulse text-slate-500 font-bold uppercase tracking-widest text-[10px]">Preparing Canvas...</div>;

  return (
    <div className="flex flex-col items-center justify-center max-w-full">
      <div 
        ref={containerRef}
        className="relative bg-slate-900 rounded-lg shadow-2xl border border-slate-700 overflow-hidden touch-none"
        style={{ 
          width: baseSize.width * zoomScale, 
          height: baseSize.height * zoomScale 
        }}
      >
        <img 
          src={imageUrl} 
          alt="To edit" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        <canvas
          ref={maskCanvasRef}
          width={baseSize.width}
          height={baseSize.height}
          style={{ 
            width: baseSize.width * zoomScale, 
            height: baseSize.height * zoomScale,
            opacity: 0.6
          }}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="mt-4 md:mt-8 mb-4 flex flex-col items-center gap-2 md:gap-3">
        <button 
          onClick={clearMask}
          className="px-6 py-2 bg-slate-800 hover:bg-rose-900/40 hover:text-rose-400 border border-slate-700 text-slate-300 rounded-xl text-[10px] md:text-xs font-bold transition-all"
        >
          Clear Selection
        </button>
        <div className="px-3 md:px-4 py-1 md:py-1.5 bg-slate-900/50 rounded-full border border-slate-800 flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
           <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mark target areas</span>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
