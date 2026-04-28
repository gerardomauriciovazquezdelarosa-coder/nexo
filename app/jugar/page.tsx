"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  { nombre: "⚽ Mundial 2026", subtemas: ["Mundial 2026 México/USA/Canadá", "Historia de los Mundiales", "Selecciones del Mundo"] },
  { nombre: "🔬 Ciencia", subtemas: ["Biología", "Física", "Química", "Astronomía"] },
  { nombre: "📚 Historia", subtemas: ["Historia de México", "Historia Mundial", "Civilizaciones Antiguas"] },
  { nombre: "🎨 Arte y Cultura", subtemas: ["Pintura", "Música", "Literatura", "Cine"] },
  { nombre: "🌿 Naturaleza", subtemas: ["Animales", "Plantas", "Ecosistemas"] },
  { nombre: "🏆 Deportes", subtemas: ["Fútbol", "Atletismo", "Natación", "Tenis"] },
];

const DIFICULTADES = [
  { id: "Principiante", emoji: "⚪" },
  { id: "Intermedio", emoji: "🔵" },
  { id: "Avanzado", emoji: "🟣" },
];

export default function Jugar() {
  const router = useRouter();
  const [temaSeleccionado, setTemaSeleccionado] = useState("");
  const [temaLibre, setTemaLibre] = useState("");
  const [dificultad, setDificultad] = useState("Principiante");
  const [categoriaAbierta, setCategoriaAbierta] = useState<number | null>(null);
  const temaFinal = temaLibre || temaSeleccionado;

  const handleJugar = () => {
    if (!temaFinal) return;
    const params = new URLSearchParams({ tema: temaFinal, dificultad });
    router.push("/partida?" + params.toString());
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8 pt-4">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white">←</button>
          <h1 className="text-2xl font-bold">Elige un tema</h1>
        </div>
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Escribe cualquier tema:</label>
          <input type="text" value={temaLibre} onChange={(e) => { setTemaLibre(e.target.value); setTemaSeleccionado(""); }} placeholder="Ej: Los Beatles, Dinosaurios, Marvel..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500" />
        </div>
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">O elige una categoría:</label>
          <div className="space-y-2">
            {CATEGORIAS.map((cat, i) => (
              <div key={i}>
                <button onClick={() => setCategoriaAbierta(categoriaAbierta === i ? null : i)} className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 transition flex justify-between items-center">
                  <span>{cat.nombre}</span>
                  <span className="text-gray-400">{categoriaAbierta === i ? "▲" : "▼"}</span>
                </button>
                {categoriaAbierta === i && (
                  <div className="mt-1 ml-4 space-y-1">
                    {cat.subtemas.map((sub, j) => (
                      <button key={j} onClick={() => { setTemaSeleccionado(sub); setTemaLibre(""); }} className={"w-full text-left px-4 py-2 rounded-lg transition text-sm " + (temaSeleccionado === sub ? "bg-white text-gray-950 font-semibold" : "bg-gray-700 hover:bg-gray-600 text-gray-300")}>
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <label className="text-gray-400 text-sm mb-2 block">Dificultad:</label>
          <div className="grid grid-cols-3 gap-2">
            {DIFICULTADES.map((d) => (
              <button key={d.id} onClick={() => setDificultad(d.id)} className={"py-3 rounded-xl text-center transition " + (dificultad === d.id ? "bg-white text-gray-950 font-semibold" : "bg-gray-800 text-gray-300 hover:bg-gray-700")}>
                <div>{d.emoji}</div>
                <div className="text-sm">{d.id}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleJugar} disabled={!temaFinal} className={"w-full py-4 rounded-2xl font-semibold text-lg transition " + (temaFinal ? "bg-white text-gray-950 hover:bg-gray-100" : "bg-gray-800 text-gray-600 cursor-not-allowed")}>
          {temaFinal ? "Generar puzzle: " + temaFinal : "Elige un tema para continuar"}
        </button>
      </div>
    </main>
  );
}