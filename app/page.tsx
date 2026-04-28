"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-7xl font-bold mb-3 tracking-tight">NEXO</h1>
        <p className="text-gray-400 text-lg mb-8">Conecta los conceptos. Desafía tu mente.</p>
        <button onClick={() => router.push("/jugar")} className="bg-white text-gray-950 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 transition w-full mb-3">Jugar ahora</button>
        <button className="border border-gray-700 text-gray-300 font-semibold px-8 py-4 rounded-2xl text-lg hover:border-gray-500 transition w-full">Iniciar sesion</button>
      </div>
    </main>
  );
}
