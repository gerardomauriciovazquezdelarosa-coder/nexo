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
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = 60, cy = 60, r = 55;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#f8f8f8";
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.clip();
      [[angle,0],[angle+1.26,r*0.5],[angle+2.51,r*0.5],[angle+3.77,r*0.5],[angle+5.03,r*0.5],[angle+0.63,r*0.85],[angle+1.88,r*0.85],[angle+3.14,r*0.85],[angle+4.4,r*0.85],[angle+5.65,r*0.85]].forEach(([a,d],i) => {
        const px = cx + Math.cos(a)*d, py = cy + Math.sin(a)*d, pr = r*0.28;
        ctx.beginPath();
        for(let k=0;k<5;k++){const b=(k*Math.PI*2)/5-Math.PI/2+a*0.3;ctx.lineTo(px+Math.cos(b)*pr,py+Math.sin(b)*pr);}
        ctx.closePath();
        ctx.fillStyle = colors[i%4];
        ctx.fill();
      });
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,255,255,0.2)";
      ctx.lineWidth=2;
      ctx.stroke();
      angle+=0.008;
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
