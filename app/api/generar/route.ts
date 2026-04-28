import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const prompt = `Eres un experto en trivia y puzzles educativos en español. Crea un puzzle tipo "Connections" sobre: "${tema}" con dificultad: ${dificultad}.

REGLAS CRÍTICAS:
- Usa SOLO datos 100% verídicos y verificables (nombres reales, fechas correctas, hechos comprobados)
- Las 16 palabras deben ser completamente únicas — NUNCA repitas la misma palabra dos veces
- Antes de responder, verifica que ninguna palabra aparece más de una vez en todo el puzzle
- REGLA MÁS IMPORTANTE: Cada palabra debe pertenecer ÚNICAMENTE a su grupo y a ningún otro. Si una palabra podría encajar en dos grupos diferentes, cámbiala por otra más específica
- Las categorías deben ser mutuamente excluyentes — ninguna palabra de un grupo puede pertenecer lógicamente a otro grupo
- Evita categorías amplias como "países campeones" si hay palabras en otros grupos que también son campeones
- Sé muy específico en las categorías para evitar ambigüedad (ej: "Países campeones SOLO en los años 30-40" en lugar de "Países campeones")
- Dificultad "${dificultad}": ${dificultad === "fácil" ? "conexiones obvias y palabras conocidas" : dificultad === "medio" ? "conexiones que requieren algo de conocimiento" : "conexiones sutiles o poco conocidas"}

EJEMPLO DE PUZZLE BIEN CONSTRUIDO (categorías que no se solapan):
- "Máximos goleadores históricos del Mundial": Klose, Ronaldo, Fontaine, Müller
- "Sedes del Mundial en Asia": Japón, Corea, Qatar, Arabia
- "Países que ganaron su primer Mundial después del 2000": España, Francia, Alemania, Argentina
- "Porteros legendarios de Mundiales": Buffon, Yashin, Banks, Zoff

Responde SOLO con este JSON válido, sin texto adicional:
{
  "tema": "nombre del tema",
  "dificultad": "${dificultad}",
  "grupos": [
    {"categoria": "nombre categoria muy específica", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#22c55e", "emoji": "🟢"},
    {"categoria": "nombre categoria muy específica", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#3b82f6", "emoji": "🔵"},
    {"categoria": "nombre categoria muy específica", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#f59e0b", "emoji": "🟡"},
    {"categoria": "nombre categoria muy específica", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#ef4444", "emoji": "🔴"}
  ],
  "pistas": ["pista general 1", "pista general 2", "pista general 3"]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Error");

    const text = content.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const puzzle = JSON.parse(jsonMatch[0]);

    // Verificar que no haya palabras duplicadas
    const todasLasPalabras = puzzle.grupos.flatMap((g: { palabras: string[] }) => g.palabras);
    const unicas = new Set(todasLasPalabras);
    if (unicas.size !== 16) {
      return NextResponse.json({ error: "Error al generar" }, { status: 500 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al generar" }, { status: 500 });
  }
}