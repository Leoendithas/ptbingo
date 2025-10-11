import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, X } from "lucide-react";
import { toast } from "sonner";

interface HandwritingCanvasProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const HandwritingCanvas = ({ onSubmit, onCancel, isSubmitting }: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognizerRef = useRef<any>(null);
  const drawingRef = useRef<any>(null);
  const activeStrokeRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const initializeCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);

      // Configure drawing style
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Fill with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Initialize handwriting recognizer
      if ('createHandwritingRecognizer' in navigator) {
        try {
          const recognizer = await (navigator as any).createHandwritingRecognizer({
            languages: ['en'],
          });
          recognizerRef.current = recognizer;
        } catch (error) {
          console.error("Failed to create handwriting recognizer:", error);
          setIsSupported(false);
          toast.error("Handwriting recognition not available in this browser");
        }
      } else {
        setIsSupported(false);
        toast.error("Handwriting recognition not supported in this browser");
      }
    };

    initializeCanvas();

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.finish();
      }
    };
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Initialize drawing if not exists
    if (!drawingRef.current && recognizerRef.current) {
      drawingRef.current = recognizerRef.current.startDrawing({
        recognitionType: 'text',
        inputType: 'touch' in e ? 'touch' : 'mouse',
      });
    }

    // Start new stroke
    if (isSupported) {
      activeStrokeRef.current = {
        stroke: new (window as any).HandwritingStroke(),
        startTime: Date.now(),
      };
      activeStrokeRef.current.stroke.addPoint({ x, y, t: 0 });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Add point to active stroke
    if (activeStrokeRef.current && isSupported) {
      const timeElapsed = Date.now() - activeStrokeRef.current.startTime;
      activeStrokeRef.current.stroke.addPoint({ x, y, t: timeElapsed });
    }
  };

  const stopDrawing = async () => {
    setIsDrawing(false);

    // Complete stroke and recognize
    if (activeStrokeRef.current && drawingRef.current && isSupported) {
      try {
        drawingRef.current.addStroke(activeStrokeRef.current.stroke);
        activeStrokeRef.current = null;

        const predictions = await drawingRef.current.getPrediction();
        if (predictions && predictions.length > 0) {
          setRecognizedText(predictions[0].text);
        }
      } catch (error) {
        console.error("Recognition error:", error);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setRecognizedText("");
    
    // Reset drawing
    if (drawingRef.current) {
      drawingRef.current.clear();
      drawingRef.current = null;
    }
  };

  const clearText = () => {
    setRecognizedText("");
  };

  const handleSubmit = () => {
    if (!recognizedText) return;
    onSubmit(recognizedText);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border-4 border-primary shadow-playful overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-64 touch-none cursor-crosshair"
        />
      </div>

      {/* Display recognized text */}
      {recognizedText && (
        <div className="bg-secondary/20 rounded-lg p-4 border-2 border-primary/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Recognized text:</p>
              <p className="text-xl font-semibold text-foreground">{recognizedText}</p>
            </div>
            <Button
              onClick={clearText}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-between">
        <Button
          onClick={clearCanvas}
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={!hasDrawn || isSubmitting}
        >
          <Eraser className="mr-2 h-5 w-5" />
          Clear Drawing
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          className="flex-1 bg-gradient-primary"
          disabled={!recognizedText || isSubmitting}
        >
          {isSubmitting ? "Checking..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};
