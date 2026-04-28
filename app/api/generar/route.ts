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
- Usa la herramienta de búsqueda web para verificar TODOS los datos antes de incluirlos
- Solo incluye datos que hayas verificado — nunca inventes ni supongas hechos
- Las 16 palabras deben ser completamente únicas — NUNCA repitas la misma palabra dos veces
- Cada palabra debe pertenecer ÚNICAMENTE a su grupo — las categorías deben ser mutuamente excluyentes
- Sé muy específico en las categorías para evitar ambigüedad
- Dificultad "${dificultad}": ${dificultad === "fácil" ? "conexiones obvias y palabras conocidas" : dificultad === "medio" ? "conexiones que requieren algo de conocimiento" : "conexiones sutiles o poco conocidas"}

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
      max_tokens: 4000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        } as Parameters<typeof client.messages.create>[0]["tools"][0],
      ],
      messages: [{ role: "user", content: prompt }],
    });

    // Extraer el texto final de la respuesta (puede venir después de búsquedas)
    const textBlock = message.content.findLast((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("Error");

    const text = textBlock.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const puzzle = JSON.parse(jsonMatch[0]);

    // Verificar que no haya palabras duplicadas
    const todasLasPalabras = puzzle.grupos.flatMap(
      (g: { palabras: string[] }) => g.palabras
    );
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