"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PartidaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tema = searchParams.get("tema") || "";
  const dificultad = searchParams.get("dificultad") || "Principiante";
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [palabras, setPalabras] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [gruposResueltos, setGruposResueltos] = useState([]);
  const [intentos, setIntentos] = useState(4);
  const [pistasUsadas, setPistasUsadas] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [gano, setGano] = useState(false);

  useEffect(() => {
    generarPuzzle();
  }, []);

  const generarPuzzle = async () => {
    setLoading(true);
    setError("");
    setGruposResueltos([]);
    setSeleccionadas([]);
    setIntentos(4);
    setPistasUsadas(0);
    setMensaje("");
    setJuegoTerminado(false);
    setGano(false);
    setPuzzle(null);
    setPalabras([]);
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, dificultad }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPuzzle(data);
const todas = data.grupos.flatMap((g: { palabras: string[] }) => g.palabras);      setPalabras(todas.sort(() => Math.random() - 0.5));
    } catch (e) {
      setError("Error al generar el puzzle. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const togglePalabra = (p) => {
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
      (g) =>
        g.palabras.every((p) => seleccionadas.includes(p)) &&
        seleccionadas.every((p) => g.palabras.includes(p))
    );
    if (grupo) {
      const nr = [...gruposResueltos, grupo];
      setGruposResueltos(nr);
      setPalabras(palabras.filter((p) => !seleccionadas.includes(p)));
      setSeleccionadas([]);
      setMensaje("✅ Correcto: " + grupo.categoria);
      setTimeout(() => setMensaje(""), 2000);
      if (nr.length === 4) {
        setGano(true);
        setJuegoTerminado(true);
      }
    } else {
      const ni = intentos - 1;
      setIntentos(ni);
      setSeleccionadas([]);
      if (ni === 0) {
        setJuegoTerminado(true);
        setGano(false);
      } else {
        setMensaje("❌ Incorrecto. Quedan " + ni + " intentos");
        setTimeout(() => setMensaje(""), 2000);
      }
    }
  };

  const usarPista = () => {
    if (pistasUsadas >= 3 || !puzzle) return;
    setMensaje("💡 Pista: " + puzzle.pistas[pistasUsadas]);
    setPistasUsadas(pistasUsadas + 1);
    setTimeout(() => setMensaje(""), 4000);
  };

  if (loading)
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚙️</div>
          <h2 className="text-xl font-semibold mb-2">Generando puzzle...</h2>
          <p className="text-gray-400">{tema}</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={generarPuzzle}
            className="bg-white text-gray-950 px-6 py-3 rounded-xl font-semibold"
          >
            Reintentar
          </button>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4 pt-4">
          <button
            onClick={() => router.push("/jugar")}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
          <div className="text-center">
            <div className="font-semibold">{tema}</div>
            <div className="text-gray-400 text-sm">{dificultad}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Intentos</div>
            <div className="font-bold">{intentos}/4</div>
          </div>
        </div>

        {gruposResueltos.map((g, i) => (
          <div
            key={i}
            className="rounded-xl p-3 mb-2 text-center"
            style={{ backgroundColor: g.color }}
          >
            <div className="font-bold text-white text-sm">
              {g.emoji} {g.categoria}
            </div>
            <div className="text-white text-xs opacity-80">
              {g.palabras.join(" · ")}
            </div>
          </div>
        ))}

        {!juegoTerminado && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {palabras.map((p, i) => (
              <button
                key={i}
                onClick={() => togglePalabra(p)}
                className={
                  "py-3 px-1 rounded-xl text-xs font-semibold text-center leading-tight " +
                  (seleccionadas.includes(p)
                    ? "bg-white text-gray-950 scale-95"
                    : "bg-gray-800 text-white hover:bg-gray-700")
                }
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {juegoTerminado && !gano && puzzle && (
          <div className="space-y-2 mb-4">
            {puzzle.grupos
              .filter(
                (g) => !gruposResueltos.find((r) => r.categoria === g.categoria)
              )
              .map((g, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 text-center opacity-60"
                  style={{ backgroundColor: g.color }}
                >
                  <div className="font-bold text-white text-sm">
                    {g.emoji} {g.categoria}
                  </div>
                  <div className="text-white text-xs">
                    {g.palabras.join(" · ")}
                  </div>
                </div>
              ))}
          </div>
        )}

        {mensaje && (
          <div className="bg-gray-800 rounded-xl p-3 mb-4 text-center text-sm">
            {mensaje}
          </div>
        )}

        {!juegoTerminado ? (
          <div className="space-y-2">
            <button
              onClick={verificar}
              disabled={seleccionadas.length !== 4}
              className={
                "w-full py-4 rounded-2xl font-semibold transition " +
                (seleccionadas.length === 4
                  ? "bg-white text-gray-950 hover:bg-gray-100"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed")
              }
            >
              Verificar ({seleccionadas.length}/4)
            </button>
            <button
              onClick={usarPista}
              disabled={pistasUsadas >= 3}
              className="w-full py-3 rounded-2xl border border-gray-700 text-gray-300 hover:border-gray-500 transition text-sm"
            >
              💡 Pista ({3 - pistasUsadas} restantes)
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {gano && (
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <div className="font-bold text-lg">¡Ganaste!</div>
              </div>
            )}
            {!gano && (
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">😔</div>
                <div className="font-bold text-lg">Se acabaron los intentos</div>
              </div>
            )}
            <button
              onClick={() => router.push("/jugar")}
              className="w-full py-4 rounded-2xl bg-white text-gray-950 font-semibold"
            >
              Jugar otro tema
            </button>
            <button
              onClick={generarPuzzle}
              className="w-full py-3 rounded-2xl border border-gray-700 text-gray-300 hover:border-gray-500 transition"
            >
              Mismo tema, nuevo puzzle
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Partida() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-gray-400">Cargando...</p>
          </div>
        </main>
      }
    >
      <PartidaContent />
    </Suspense>
  );
}
