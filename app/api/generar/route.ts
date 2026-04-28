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
- Si el tema involucra campeones, ganadores, récords o fechas — usa los datos reales exactos
- Las 16 palabras deben ser específicas y concretas, NO genéricas
- Cada grupo debe tener una conexión clara y precisa entre sus 4 palabras
- Las palabras deben ser reconocibles para un hispanohablante promedio
- Dificultad "${dificultad}": ${"`"}${dificultad === "fácil" ? "conexiones obvias y palabras conocidas" : dificultad === "medio" ? "conexiones que requieren algo de conocimiento" : "conexiones sutiles o poco conocidas"}${"`"}

EJEMPLOS de grupos buenos:
- "Países que han ganado más de 3 Mundiales": Brasil, Alemania, Italia, Argentina
- "Capitales de América del Sur": Bogotá, Lima, Santiago, Buenos Aires

Responde SOLO con este JSON válido, sin texto adicional:
{
  "tema": "nombre del tema",
  "dificultad": "${dificultad}",
  "grupos": [
    {"categoria": "nombre categoria", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#22c55e", "emoji": "🟢"},
    {"categoria": "nombre categoria", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#3b82f6", "emoji": "🔵"},
    {"categoria": "nombre categoria", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#f59e0b", "emoji": "🟡"},
    {"categoria": "nombre categoria", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#ef4444", "emoji": "🔴"}
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
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al generar" }, { status: 500 });
  }
}