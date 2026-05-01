"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let angle = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = 60, cy = 60, R = 54;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 1, 0, Math.PI * 2);
      ctx.clip();
      const pr = R * 0.3;
      function drawPent(px, py, rot) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2;
          if (i === 0) ctx.moveTo(px + pr * Math.cos(a), py + pr * Math.sin(a));
          else ctx.lineTo(px + pr * Math.cos(a), py + pr * Math.sin(a));
        }
        ctx.closePath();
        ctx.fillStyle = "#111111";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      drawPent(cx, cy, angle);
      for (let i = 0; i < 5; i++) {
        const a = angle + (i * 2 * Math.PI) / 5 - Math.PI / 2;
        drawPent(cx + R * 0.58 * Math.cos(a), cy + R * 0.58 * Math.sin(a), angle + i);
      }
      ctx.restore();
      angle += 0.005;
    }
    const id = setInterval(draw, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black" />
      <div className="relative z-10 flex gap-2 mb-8">
        <div className="w-8 h-1 rounded-full bg-green-500" />
        <div className="w-8 h-1 rounded-full bg-blue-500" />
        <div className="w-8 h-1 rounded-full bg-yellow-500" />
        <div className="w-8 h-1 rounded-full bg-red-500" />
      </div>
      <div className="relative z-10 mb-4">
        <h1 className="text-8xl font-black tracking-tight">
          <span className="text-green-500">N</span>
          <span className="text-blue-500">E</span>
          <span className="text-yellow-500">X</span>
          <span className="text-red-500">O</span>
        </h1>
      </div>
      <div className="relative z-10 text-center mb-8">
        <p className="text-gray-300 text-lg">Conecta los conceptos.</p>
        <p className="text-gray-400 text-lg italic">Desafía tu mente.</p>
      </div>
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <canvas ref={canvasRef} width={120} height={120} />
        <div className="text-3xl font-black animate-pulse">
          <span className="text-green-400">G</span><span className="text-blue-400">O</span><span className="text-yellow-400">O</span><span className="text-red-400">O</span><span className="text-green-400">O</span><span className="text-blue-400">O</span><span className="text-yellow-400">O</span><span className="text-red-400">O</span><span className="text-green-400">L</span>
        </div>
      </div>
      <div className="relative z-10 flex gap-8 mb-10 text-center">
        <div><div className="text-2xl font-bold">12K+</div><div className="text-xs text-gray-500 uppercase">Jugadores</div></div>
        <div><div className="text-2xl font-bold">500+</div><div className="text-xs text-gray-500 uppercase">Puzzles</div></div>
        <div><div className="text-2xl font-bold">4</div><div className="text-xs text-gray-500 uppercase">Niveles</div></div>
      </div>
      <div className="relative z-10 w-full max-w-sm space-y-3">
        <button onClick={() => router.push("/jugar")} className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90 transition">Jugar ahora</button>
        <button className="w-full py-4 rounded-2xl font-bold text-lg border border-gray-700 text-gray-300 hover:border-gray-500 transition">Como jugar</button>
      </div>
    </main>
  );
}