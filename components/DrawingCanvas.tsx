import React, { useRef, useEffect, useState, useCallback } from "react";
import { DrawTool } from "../types";

interface DrawingCanvasProps {
  imageUrl: string;
  onMaskChange: (maskBase64: string | null) => void;
  onCrop: (x: number, y: number, width: number, height: number) => void;
  brushSize: number;
  brushColor: string;
  activeTool: DrawTool;
  zoomScale: number;
}

interface ShapeState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  imageUrl,
  onMaskChange,
  onCrop,
  brushSize,
  brushColor,
  activeTool,
  zoomScale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });
  const [shapeState, setShapeState] = useState<ShapeState | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const isMobile = window.innerWidth < 1024;
      const horizontalPadding = isMobile ? 40 : 120;
      const verticalPadding = isMobile ? 180 : 200;
      const maxWidth =
        window.innerWidth - (isMobile ? 0 : 320 + 256) - horizontalPadding;
      const maxHeight = window.innerHeight - verticalPadding;
      let width = img.width;
      let height = img.height;
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
      setBaseSize({ width, height });
    };
  }, [imageUrl]);

  // Clear overlay canvas when tool changes
  useEffect(() => {
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext("2d");
      ctx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
    setShapeState(null);
  }, [activeTool]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      return {
        x: (clientX - rect.left) / (rect.width / canvas.width),
        y: (clientY - rect.top) / (rect.height / canvas.height),
      };
    },
    []
  );

  const isShapeTool =
    activeTool === DrawTool.CROP ||
    activeTool === DrawTool.RECT_SELECT ||
    activeTool === DrawTool.ELLIPSE_SELECT;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e, canvas);

    if (isShapeTool) {
      setShapeState({ startX: x, startY: y, endX: x, endY: y });
    }
    setIsDrawing(true);

    if (!isShapeTool) {
      draw(e);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);

    if (isShapeTool && shapeState) {
      // For shape tools, draw final shape to mask canvas
      const canvas = maskCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const { startX, startY, endX, endY } = shapeState;
          const width = endX - startX;
          const height = endY - startY;

          ctx.fillStyle = "red";
          ctx.globalCompositeOperation = "source-over";

          if (
            activeTool === DrawTool.RECT_SELECT ||
            activeTool === DrawTool.CROP
          ) {
            ctx.fillRect(startX, startY, width, height);
          } else if (activeTool === DrawTool.ELLIPSE_SELECT) {
            ctx.beginPath();
            ctx.ellipse(
              startX + width / 2,
              startY + height / 2,
              Math.abs(width / 2),
              Math.abs(height / 2),
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
        onMaskChange(canvas.toDataURL("image/png"));
      }

      // Clear overlay
      const overlayCanvas = overlayCanvasRef.current;
      if (overlayCanvas) {
        const overlayCtx = overlayCanvas.getContext("2d");
        overlayCtx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      }
    } else {
      const canvas = maskCanvasRef.current;
      if (canvas) {
        onMaskChange(canvas.toDataURL("image/png"));
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e, canvas);

    if (isShapeTool) {
      // Update shape state and draw preview on overlay
      setShapeState((prev) => (prev ? { ...prev, endX: x, endY: y } : null));

      const overlayCanvas = overlayCanvasRef.current;
      if (overlayCanvas && shapeState) {
        const ctx = overlayCanvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

          const width = x - shapeState.startX;
          const height = y - shapeState.startY;

          ctx.strokeStyle = activeTool === DrawTool.CROP ? "#00ff00" : "red";
          ctx.lineWidth = 2;
          ctx.setLineDash(activeTool === DrawTool.CROP ? [5, 5] : []);

          if (
            activeTool === DrawTool.RECT_SELECT ||
            activeTool === DrawTool.CROP
          ) {
            ctx.strokeRect(shapeState.startX, shapeState.startY, width, height);
            if (activeTool === DrawTool.CROP) {
              // Draw crop overlay (darken outside)
              ctx.fillStyle = "rgba(0,0,0,0.5)";
              ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
              ctx.clearRect(
                shapeState.startX,
                shapeState.startY,
                width,
                height
              );
            }
          } else if (activeTool === DrawTool.ELLIPSE_SELECT) {
            ctx.beginPath();
            ctx.ellipse(
              shapeState.startX + width / 2,
              shapeState.startY + height / 2,
              Math.abs(width / 2),
              Math.abs(height / 2),
              0,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
        }
      }
      return;
    }

    // Brush drawing
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMaskTool =
      activeTool === DrawTool.AI_EDIT || activeTool === DrawTool.NONE;
    const isEraserTool = activeTool === DrawTool.ERASER;

    if (isEraserTool) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.fillStyle = isMaskTool ? "red" : brushColor;
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onMaskChange(null);
    }
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext("2d");
      ctx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
    setShapeState(null);
  };

  const applyCrop = () => {
    if (shapeState) {
      const { startX, startY, endX, endY } = shapeState;
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      onCrop(x, y, width, height);
      clearMask();
    }
  };

  if (baseSize.width === 0) {
    return (
      <div className="animate-pulse text-slate-500 font-bold uppercase tracking-widest text-[10px]">
        Preparing Canvas...
      </div>
    );
  }

  const getToolHint = () => {
    switch (activeTool) {
      case DrawTool.AI_EDIT:
      case DrawTool.NONE:
        return "Mark areas for AI editing";
      case DrawTool.CROP:
        return "Draw crop area";
      case DrawTool.RECT_SELECT:
        return "Draw rectangle selection";
      case DrawTool.ELLIPSE_SELECT:
        return "Draw ellipse selection";
      case DrawTool.COLOR_BRUSH:
        return "Draw with color";
      case DrawTool.ERASER:
        return "Erase strokes";
      default:
        return "Select a tool";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-full">
      <div
        ref={containerRef}
        className="relative bg-slate-900 rounded-lg shadow-2xl border border-slate-700 overflow-hidden touch-none"
        style={{
          width: baseSize.width * zoomScale,
          height: baseSize.height * zoomScale,
        }}
      >
        <img
          src={imageUrl}
          alt="To edit"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        {/* Mask canvas for brush strokes */}
        <canvas
          ref={maskCanvasRef}
          width={baseSize.width}
          height={baseSize.height}
          style={{
            width: baseSize.width * zoomScale,
            height: baseSize.height * zoomScale,
            opacity: 0.6,
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
        {/* Overlay canvas for shape previews */}
        <canvas
          ref={overlayCanvasRef}
          width={baseSize.width}
          height={baseSize.height}
          style={{
            width: baseSize.width * zoomScale,
            height: baseSize.height * zoomScale,
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
      <div className="mt-4 md:mt-8 mb-4 flex flex-col items-center gap-2 md:gap-3">
        <div className="flex gap-2">
          <button
            onClick={clearMask}
            className="px-6 py-2 bg-slate-800 hover:bg-rose-900/40 hover:text-rose-400 border border-slate-700 text-slate-300 rounded-xl text-[10px] md:text-xs font-bold transition-all"
          >
            Clear
          </button>
          {activeTool === DrawTool.CROP && shapeState && (
            <button
              onClick={applyCrop}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 border border-green-500 text-white rounded-xl text-[10px] md:text-xs font-bold transition-all"
            >
              Apply Crop
            </button>
          )}
        </div>
        <div className="px-3 md:px-4 py-1 md:py-1.5 bg-slate-900/50 rounded-full border border-slate-800 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full animate-pulse`}
            style={{
              backgroundColor: activeTool === DrawTool.CROP ? "#00ff00" : "red",
            }}
          />
          <span className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {getToolHint()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
