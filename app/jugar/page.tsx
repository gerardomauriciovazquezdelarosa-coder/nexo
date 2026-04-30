"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  { nombre: "🏛️ Historia", subtemas: ["Historia de México"] },
  { nombre: "🎨 Arte", subtemas: ["Arte"] },
  { nombre: "📖 Literatura", subtemas: ["Literatura Universal"] },
  { nombre: "🧮 Matemáticas", subtemas: ["Matemáticas"] },
  { nombre: "🔭 Ciencia", subtemas: ["Ciencia"] },
  { nombre: "🌎 Geografía", subtemas: ["Geografía"] },
  { nombre: "⚽ Deportes", subtemas: ["Deportes"] },
  { nombre: "🧠 Filosofía", subtemas: ["Filosofía"] },
  { nombre: "🔧 Herramientas", subtemas: ["Herramientas"] },
  { nombre: "🎭 Personajes ficticios", subtemas: ["Personajes ficticios"] },
];

const DIFICULTADES = [
  { id: "fácil", label: "Fácil", emoji: "⚪", descripcion: "Para niños" },
  { id: "medio", label: "Medio", emoji: "🔵", descripcion: "Cultura general" },
  { id: "difícil", label: "Difícil", emoji: "🟣", descripcion: "Para expertos" },
];

export default function Jugar() {
  const router = useRouter();
  const [temaSeleccionado, setTemaSeleccionado] = useState("");
  const [dificultad, setDificultad] = useState("fácil");
  const [categoriaAbierta, setCategoriaAbierta] = useState<number | null>(null);

  const handleJugar = () => {
    if (!temaSeleccionado) return;
    const params = new URLSearchParams({ tema: temaSeleccionado, dificultad });
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
          <label className="text-gray-400 text-sm mb-3 block">Categorías:</label>
          <div className="space-y-2">
            {CATEGORIAS.map((cat, i) => (
              <div key={i}>
                <button
                  onClick={() => setCategoriaAbierta(categoriaAbierta === i ? null : i)}
                  className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 transition flex justify-between items-center"
                >
                  <span>{cat.nombre}</span>
                  <span className="text-gray-400">{categoriaAbierta === i ? "▲" : "▼"}</span>
                </button>
                {categoriaAbierta === i && (
                  <div className="mt-1 ml-4 space-y-1">
                    {cat.subtemas.map((sub, j) => (
                      <button
                        key={j}
                        onClick={() => setTemaSeleccionado(sub)}
                        className={"w-full text-left px-4 py-2 rounded-lg transition text-sm " +
                          (temaSeleccionado === sub
                            ? "bg-white text-gray-950 font-semibold"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300")}
                      >
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
          <label className="text-gray-400 text-sm mb-3 block">Dificultad:</label>
          <div className="grid grid-cols-3 gap-2">
            {DIFICULTADES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDificultad(d.id)}
                className={"py-3 rounded-xl text-center transition " +
                  (dificultad === d.id
                    ? "bg-white text-gray-950 font-semibold"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700")}
              >
                <div>{d.emoji}</div>
                <div className="text-sm font-medium">{d.label}</div>
                <div className="text-xs opacity-60">{d.descripcion}</div>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleJugar}
          disabled={!temaSeleccionado}
          className={"w-full py-4 rounded-2xl font-semibold text-lg transition " +
            (temaSeleccionado
              ? "bg-white text-gray-950 hover:bg-gray-100"
              : "bg-gray-800 text-gray-600 cursor-not-allowed")}
        >
          {temaSeleccionado ? "▶ Jugar: " + temaSeleccionado : "Elige un tema para continuar"}
        </button>
      </div>
    </main>
  );
}