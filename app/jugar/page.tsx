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
    let goalOpacity = 0;
    let goalPhase = 0;
    let frame = 0;

    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

    function drawBall() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 55;

      // Sombra
      ctx.shadowColor = "rgba(255,255,255,0.1)";
      ctx.shadowBlur = 20;

      // Fondo blanco del balón
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#f8f8f8";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pentágonos de colores
      const patches = [
        { a: angle, d: 0 },
        { a: angle + Math.PI * 0.4, d: r * 0.5 },
        { a: angle + Math.PI * 0.8, d: r * 0.5 },
        { a: angle + Math.PI * 1.2, d: r * 0.5 },
        { a: angle + Math.PI * 1.6, d: r * 0.5 },
        { a: angle + Math.PI * 0.2, d: r * 0.85 },
        { a: angle + Math.PI * 0.6, d: r * 0.85 },
        { a: angle + Math.PI * 1.0, d: r * 0.85 },
        { a: angle + Math.PI * 1.4, d: r * 0.85 },
        { a: angle + Math.PI * 1.8, d: r * 0.85 },
      ];

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.clip();

      patches.forEach((p, i) => {
        const px = cx + Math.cos(p.a) * p.d;
        const py = cy + Math.sin(p.a) * p.d;
        const pr = r * 0.28;
        ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const a = (k * Math.PI * 2) / 5 - Math.PI / 2 + p.a * 0.3;
          const x = px +