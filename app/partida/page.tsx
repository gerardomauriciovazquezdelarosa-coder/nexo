"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const MENSAJES_CARGA = [
  { emoji: "🔍", texto: "Buscando tu puzzle..." },
  { emoji: "📚", texto: "Seleccionando preguntas..." },
  { emoji: "🧩", texto: "Construyendo el desafío..." },
  { emoji: "🎯", texto: "Preparando el juego..." },
  { emoji: "⚡", texto: "¡Casi listo!" },
];

function PartidaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tema = searchParams.get("tema") || "";
  const dificultad = searchParams.get("dificultad") || "fácil";
  const [puzzle, setPuzzle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [palabras, setPalabras] = useState<string[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [gruposResueltos, setGruposResueltos] = useState<any[]>([]);
  const [intentos, setIntentos] = useState(4);
  const [pistasUsadas, setPistasUsadas] = useState(0);
  const [pistaVisible, setPistaVisible] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [gano, setGano] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState(0);

  useEffect(() => { generarPuzzle(); }, []);

  useEffect(() => {
    if (!loading) return;
    const intervalo = setInterval(() => {
      setMensajeCarga((prev) => (prev + 1) % MENSAJES_CARGA.length);
    }, 2500);
    return () => clearInterval(intervalo);
  }, [loading]);

  const generarPuzzle = async () => {
    setLoading(true);
    setError("");
    setGruposResueltos([]);
    setSeleccionadas([]);
    setIntentos(4);
    setPistasUsadas(0);
    setPistaVisible(null);
    setMensaje("");
    setJuegoTerminado(false);
    setGano(false);
    setPuzzle(null);
    setPalabras([]);
    try {
      const { data: filas, error: dbError } = await supabase
          .from('puzzles')
          .select('*')
          .eq('tema', tema)
          .eq('nivel', dificultad);
        if (dbError) throw new Error(dbError.message);
        if (!filas || filas.length < 4) throw new Error('No hay suficientes puzzles');
        const mezcladas = filas.sort(() => Math.random() - 0.5).slice(0, 4);
        const colores = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
        const emojis = ['🟢', '🔵', '🟡', '🔴'];
        const grupos = mezcladas.map((fila: any, i: number) => ({
          categoria: fila.titulo,
          palabras: [fila.palabra1, fila.palabra2, fila.palabra3, fila.palabra4],
          color: colores[i],
          emoji: emojis[i],
        }));
        const data = { tema, dificultad, grupos };;
      setPuzzle(data);
      const todas = data.grupos.flatMap((g: any) => g.palabras);
      setPalabras(todas.sort(() => Math.random() - 0.5));
    } catch (e) {
      setError("Error al generar el puzzle. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const togglePalabra = (p: string) => {
    if (juegoTerminado) return;
    if (seleccionadas.includes(p)) {
      setSeleccionadas(seleccionadas.filter((x) => x !== p));
    } else if (seleccionadas.length < 4) {
      setSeleccionadas([...seleccionadas, p]);
    }
  };

  const verificar = () => {
    if (seleccionadas.length !== 4 || !puzzle) return;
    const grupo = puzzle.grupos.find(
      (g: any) =>
        g.palabras.every((p: string) => seleccionadas.includes(p)) &&
        seleccionadas.every((p) => g.palabras.includes(p))
    );
    if (grupo) {
      const nr = [...gruposResueltos, grupo];
      setGruposResueltos(nr);
      setPalabras(palabras.filter((p) => !seleccionadas.includes(p)));
      setSeleccionadas([]);
      setMensaje("✅ " + grupo.categoria);
      setTimeout(() => setMensaje(""), 3000);
      if (nr.length === 4) { setGano(true); setJuegoTerminado(true); }
    } else {
      const ni = intentos - 1;
      setIntentos(ni);
      setSeleccionadas([]);
      if (ni === 0) { setJuegoTerminado(true); setGano(false); }
      else {
        setMensaje("❌ Incorrecto — " + ni + " intentos restantes");
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  const mezclar = () => setPalabras([...palabras].sort(() => Math.random() - 0.5));

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">{MENSAJES_CARGA[mensajeCarga].emoji}</div>
        <h2 className="text-xl font-semibold mb-2">{MENSAJES_CARGA[mensajeCarga].texto}</h2>
        <p className="text-gray-400 mb-6">{tema}</p>
        <div className="flex gap-1 justify-center">
          {MENSAJES_CARGA.map((_, i) => (
            <div key={i} className={"w-2 h-2 rounded-full transition-all " + (i === mensajeCarga ? "bg-white scale-125" : "bg-gray-700")} />
          ))}
        </div>
      </div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-red-400 mb-6">{error}</p>
        <button onClick={generarPuzzle} className="bg-white text-gray-950 px-8 py-3 rounded-xl font-bold">Reintentar</button>
      </div>
    </main>
  );

  if (juegoTerminado) return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          {gano ? (
            <>
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-black mb-1">¡Puzzle resuelto!</h2>
              <p className="text-gray-400">{tema} · {dificultad}</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-3xl font-black mb-1">Se acabaron los intentos</h2>
              <p className="text-gray-400">{tema} · {dificultad}</p>
            </>
          )}
        </div>

        <div className="space-y-2 mb-8">
          {puzzle.grupos.map((g: any, i: number) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: g.color }}>
              <div className="font-bold text-white text-sm">{g.emoji} {g.categoria}</div>
              <div className="text-white text-xs opacity-80 mt-1">{g.palabras.join(" · ")}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-gray-900 rounded-xl p-3">
            <div className="text-2xl font-bold">4</div>
            <div className="text-xs text-gray-500 uppercase">Grupos</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3">
            <div className="text-2xl font-bold">16</div>
            <div className="text-xs text-gray-500 uppercase">Palabras</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-3">
            <div className="text-2xl font-bold">{gano ? "✓" : intentos}</div>
            <div className="text-xs text-gray-500 uppercase">{gano ? "Completo" : "Fallos"}</div>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={generarPuzzle} className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
            Otro puzzle →
          </button>
          <button onClick={() => router.push("/jugar")} className="w-full py-3 rounded-2xl border border-gray-700 text-gray-300 font-semibold">
            ← Cambiar tema
          </button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4 pt-4">
          <button onClick={() => router.push("/jugar")} className="text-gray-400 hover:text-white">←</button>
          <div className="text-center">
            <div className="font-bold text-sm">{tema}</div>
            <div className="text-gray-500 text-xs">{dificultad}</div>
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={"w-3 h-3 rounded-full " + (i < intentos ? "bg-white" : "bg-gray-700")} />
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {gruposResueltos.map((g, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: g.color }}>
              <div className="font-bold text-white text-sm">{g.emoji} {g.categoria}</div>
              <div className="text-white text-xs opacity-80">{g.palabras.join(" · ")}</div>
            </div>
          ))}
        </div>

        {mensaje && (
          <div className="bg-gray-800 rounded-xl p-3 mb-3 text-center text-sm font-semibold">{mensaje}</div>
        )}

        {pistaVisible && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-3 mb-3 flex justify-between items-start gap-2">
            <p className="text-yellow-100 text-sm">💡 {pistaVisible}</p>
            <button onClick={() => setPistaVisible(null)} className="text-yellow-400 font-bold shrink-0">✕</button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {palabras.map((p, i) => (
            <button
              key={i}
              onClick={() => togglePalabra(p)}
              className={"py-3 px-1 rounded-xl text-xs font-semibold text-center leading-tight transition " +
                (seleccionadas.includes(p)
                  ? "bg-white text-gray-950 scale-95 shadow-lg"
                  : "bg-gray-800 text-white hover:bg-gray-700")}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={verificar}
            disabled={seleccionadas.length !== 4}
            className={"w-full py-4 rounded-2xl font-bold text-lg transition " +
              (seleccionadas.length === 4
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90"
                : "bg-gray-800 text-gray-600 cursor-not-allowed")}
          >
            Confirmar ({seleccionadas.length}/4)
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={mezclar} className="py-3 rounded-xl border border-gray-700 text-gray-300 text-sm font-semibold hover:border-gray-500 transition">
              ⇄ Mezclar
            </button>
            <button
              onClick={() => {
                if (pistasUsadas >= 3 || !puzzle) return;
                setPistaVisible(puzzle.pistas[pistasUsadas]);
                setPistasUsadas(pistasUsadas + 1);
              }}
              disabled={pistasUsadas >= 3}
              className={"py-3 rounded-xl border text-sm font-semibold transition " +
                (pistasUsadas < 3
                  ? "border-yellow-700 text-yellow-400 hover:border-yellow-500"
                  : "border-gray-800 text-gray-700 cursor-not-allowed")}
            >
              💡 Pista ({3 - pistasUsadas})
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Partida() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </main>
    }>
      <PartidaContent />
    </Suspense>
  );
}
