"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  { nombre: "Historia de México", emoji: "🏛️", desc: "Hechos y personajes históricos" },
  { nombre: "Arte", emoji: "🎨", desc: "Movimientos, obras y artistas" },
  { nombre: "Literatura Universal", emoji: "📖", desc: "Autores, obras y personajes" },
  { nombre: "Matemáticas", emoji: "🧮", desc: "Conceptos y teorías matemáticas" },
  { nombre: "Ciencia", emoji: "🔭", desc: "Biología, física y química" },
  { nombre: "Geografía", emoji: "🌎", desc: "Países, capitales y accidentes" },
  { nombre: "Deportes", emoji: "🏆", desc: "Atletas, equipos y disciplinas" },
  { nombre: "Filosofía", emoji: "🧠", desc: "Pensadores y corrientes" },
  { nombre: "Herramientas", emoji: "🔧", desc: "Instrumentos y utensilios" },
  { nombre: "Personajes ficticios", emoji: "🎭", desc: "Literatura, cine y series" },
  { nombre: "Historia de los Mundiales", emoji: "🏆", desc: "Goles, campeones y récords" },
  { nombre: "Mundial 2026", emoji: "⚽", desc: "Jugadores y selecciones" },
];

const DIFICULTADES = [
  { id: "fácil", label: "Fácil", desc: "Para todos" },
  { id: "medio", label: "Medio", desc: "Cultura general" },
  { id: "difícil", label: "Difícil", desc: "Para expertos" },
];

export default function Jugar() {
  const router = useRouter();
  const [temaSeleccionado, setTemaSeleccionado] = useState("");
  const [dificultad, setDificultad] = useState("fácil");

  const handleJugar = () => {
    if (!temaSeleccionado) return;
    const params = new URLSearchParams({ tema: temaSeleccionado, dificultad });
    router.push("/partida?" + params.toString());
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6 pt-4">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white text-xl">←</button>
          <div>
            <h1 className="text-2xl font-black">Elige tu desafío</h1>
            <p className="text-gray-500 text-sm">Tema y dificultad</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Dificultad</p>
          <div className="grid grid-cols-3 gap-2">
            {DIFICULTADES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDificultad(d.id)}
                className={"py-3 px-2 rounded-xl text-center transition border " +
                  (dificultad === d.id
                    ? "bg-white text-gray-950 border-white font-bold"
                    : "bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500")}
              >
                <div className="font-semibold text-sm">{d.label}</div>
                <div className="text-xs opacity-60">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Categoría</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.nombre}
                onClick={() => setTemaSeleccionado(cat.nombre)}
                className={"p-3 rounded-xl text-left transition border " +
                  (temaSeleccionado === cat.nombre
                    ? "bg-white text-gray-950 border-white"
                    : "bg-gray-900 text-gray-300 border-gray-800 hover:border-gray-600")}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="font-semibold text-sm leading-tight">{cat.nombre}</div>
                <div className={"text-xs mt-1 " + (temaSeleccionado === cat.nombre ? "text-gray-600" : "text-gray-500")}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleJugar}
          disabled={!temaSeleccionado}
          className={"w-full py-4 rounded-2xl font-bold text-lg transition sticky bottom-4 " +
            (temaSeleccionado
              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90"
              : "bg-gray-800 text-gray-600 cursor-not-allowed")}
        >
          {temaSeleccionado ? "▶ Jugar: " + temaSeleccionado : "Elige un tema para continuar"}
        </button>
      </div>
    </main>
  );
}
