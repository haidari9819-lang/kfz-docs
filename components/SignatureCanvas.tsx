"use client";

import { useRef, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  onSign: (base64: string) => void;
  onClear: () => void;
}

export default function SignatureCanvas({ onSign, onClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasSig, setHasSig] = useState(false);

  // Stabile Refs für Callbacks — vermeidet stale closures im useEffect
  const onSignRef = useRef(onSign);
  const onClearRef = useRef(onClear);
  useEffect(() => { onSignRef.current = onSign; }, [onSign]);
  useEffect(() => { onClearRef.current = onClear; }, [onClear]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    function getPos(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (canvas!.width / rect.width),
        y: (clientY - rect.top) * (canvas!.height / rect.height),
      };
    }

    function start(x: number, y: number) {
      isDrawing.current = true;
      ctx!.beginPath();
      ctx!.moveTo(x, y);
    }

    function move(x: number, y: number) {
      if (!isDrawing.current) return;
      ctx!.lineTo(x, y);
      ctx!.stroke();
      setHasSig(true);
      onSignRef.current(canvas!.toDataURL("image/png"));
    }

    function stop() {
      isDrawing.current = false;
    }

    // Mouse
    const onMouseDown = (e: MouseEvent) => {
      const { x, y } = getPos(e.clientX, e.clientY);
      start(x, y);
    };
    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getPos(e.clientX, e.clientY);
      move(x, y);
    };

    // Touch (non-passive für preventDefault)
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const { x, y } = getPos(t.clientX, t.clientY);
      start(x, y);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const { x, y } = getPos(t.clientX, t.clientY);
      move(x, y);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", stop);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", stop);
    };
  }, []);

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
    onClearRef.current();
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 rounded-xl overflow-hidden transition-colors ${
          hasSig ? "border-green-400" : "border-gray-200"
        }`}
      >
        {!hasSig && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-sm text-gray-300 italic">Unterschrift hier</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full h-[150px] touch-none cursor-crosshair bg-white"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={12} /> Unterschrift löschen
        </button>
      </div>
    </div>
  );
}
