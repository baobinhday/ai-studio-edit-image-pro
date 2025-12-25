
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface DrawingCanvasProps {
  imageUrl: string;
  onMaskChange: (maskBase64: string | null) => void;
  brushSize: number;
  zoomScale: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ imageUrl, onMaskChange, brushSize, zoomScale }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Find parent container dimension to establish initial "fit" size
      // We assume the parent of the root in App provides the constraint
      const viewportPadding = 64; 
      const maxWidth = (window.innerWidth - 320 - 256) - viewportPadding; // Subtracting sidebars
      const maxHeight = (window.innerHeight - 64 - 40) - viewportPadding; // Subtracting header/footer
      
      let width = img.width;
      let height = img.height;
      
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
      
      setBaseSize({ width, height });
    };
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
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

    // Adjust coordinates based on the actual bounding rect and the zoom scale
    // rect.width / canvas.width gives us the current visual scale
    const x = (clientX - rect.left) / (rect.width / canvas.width);
    const y = (clientY - rect.top) / (rect.height / canvas.height);

    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
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

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div 
        ref={containerRef}
        className="relative bg-slate-900 rounded-lg shadow-2xl border border-slate-700 transition-all duration-75"
        style={{ 
          width: baseSize.width * zoomScale, 
          height: baseSize.height * zoomScale 
        }}
      >
        <img 
          ref={imageRef}
          src={imageUrl} 
          alt="To edit" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-lg"
        />
        <canvas
          ref={maskCanvasRef}
          width={baseSize.width}
          height={baseSize.height}
          style={{ 
            width: baseSize.width * zoomScale, 
            height: baseSize.height * zoomScale 
          }}
          className="absolute inset-0 cursor-crosshair rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="mt-6 mb-12 flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <button 
            onClick={clearMask}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-all shadow-md"
          >
            Clear Selection
          </button>
        </div>
        <p className="text-slate-500 text-[10px] flex items-center">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
          Paint the areas you want the AI to modify
        </p>
      </div>
    </div>
  );
};

export default DrawingCanvas;
