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
  const dificultad = searchParams.get("dificultad") || "fácil";
  const [puzzle, setPuzzle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [palabras, setPalabras] = useState<string[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [gruposResueltos, setGruposResueltos] = useState<any[]>([]);
  const [intentos, setIntentos] = useState(4);
  const [pistasUsadas, setPistasUsadas] = useState(0);
  const [pistaVisible, setPistaVisible] = useState<string | null>(null); // pista visible hasta que el usuario la cierre
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
      setMensajeCarga((