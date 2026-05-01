"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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
      <div className="relative z-10 text-center mb-8">
        <div className="text-2xl font-black animate-pulse">
          <span className="text-green-400">G</span><span className="text-blue-400">O</span><span className="text-yellow-400">O</span><span className="text-red-400">O</span><span className="text-green-400">O</span><span className="text-blue-400">O</span><span className="text-yellow-400">O</span><span className="text-red-400">O</span><span className="text-green-400">L</span><span className="text-white"> MUNDIALISTA</span>
        </div>
      </div>
      <div className="relative z-10 flex gap-8 mb-10 text-center">
        <div><div className="text-2xl font-bold">12K+</div><div className="text-xs text-gray-500 uppercase">Jugadores</div></div>
        <div><div className="text-2xl font-bold">500+</div><div className="text-xs text-gray-500 uppercase">Puzzles</div></div>
        <div><div className="text-2xl font-bold">4</div><div className="text-xs text-gray-500 uppercase">Niveles</div></div>
      </div>
      <div className="relative z-10 w-full max-w-sm space-y-3">
        <button onClick={() => router.push("/jugar")} className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90 transition">Jugar ahora</button>
        <button onClick={() => router.push("/como-jugar")} className="w-full py-4 rounded-2xl font-bold text-lg border border-gray-700 text-gray-300 hover:border-gray-500 transition">Como jugar</button>
      </div>
    </main>
  );
}