"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MENSAJES_CARGA = [
  { emoji: "🔍", texto: "Buscando información verificada..." },
  { emoji: "📚", texto: "Consultando fuentes confiables..." },
  { emoji: "🧩", texto: "Construyendo tu puzzle..." },
  { emoji: "✅", texto: "Verificando que todo sea correcto..." },
  { emoji: "🎯", texto: "Preparando el desafío..." },
  { emoji: "⚡", texto: "¡Casi listo!" },
];

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
  const [mensajeCarga, setMensajeCarga] = useState(0);

  useEffect(() => {
    generarPuzzle();
  }, []);

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
    setMensaje("");
    setJuegoTerminado(false);
    setGano(false);
    setPuzzle(null);
    setPalabras([]);
    setMensajeCarga(0);
    try {
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, dificultad }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPuzzle(data);
      const todas = data.grupos.flatMap((g: { palabras: string[] }) => g.palabras);
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
      setTimeout(() => setMensaje(""), 3000);
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
        setTimeout(() => setMensaje(""), 3000);
      }
    }
  };

  const usarPista = () => {
    if (pistasUsadas >= 3 || !puzzle) return;
    setMensaje("💡 Pista: " + puzzle.pistas[pistasUsadas]);
    setPistasUsadas(pistasUsadas + 1);
    setTimeout(() => setMensaje(""), 10000);
  };

  if (loading)
    return (
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4"></main>