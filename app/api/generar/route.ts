import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    // PASO 1: Buscar y verificar datos reales sobre el tema
    const busqueda = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        } as Parameters<typeof client.messages.create>[0]["tools"][0],
      ],
      messages: [
        {
          role: "user",
          content: `Busca en internet información factual y verificada sobre: "${tema}". 
Necesito datos concretos y 100% verídicos para crear un puzzle educativo.
Busca al menos 3 veces con diferentes consultas para obtener datos variados.
Lista todos los datos verificados que encuentres, organizados por categorías posibles.
NO inventes nada — solo incluye lo que encuentres en fuentes reales.`,
        },
      ],
    });

    // Extraer el resumen de datos verificados
    const datosVerificados = busqueda.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");

    // PASO 2: Generar el puzzle SOLO con los datos verificados
    const puzzle_response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Usando ÚNICAMENTE estos datos verificados de internet:

${datosVerificados}

Crea un puzzle tipo "Connections" sobre "${tema}" con dificultad: ${dificultad}.

REGLAS:
- Usa SOLO datos que aparecen en la información verificada de arriba — NO agregues nada de tu memoria
- Las 16 palabras deben ser completamente únicas — NUNCA repitas la misma palabra
- Las categorías deben ser mutuamente excluyentes — ninguna palabra puede pertenecer a dos grupos
- Sé muy específico en los nombres de categorías para evitar ambigüedad
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
}`,
        },
      ],
    });

    const textBlock = puzzle_response.content.find((b) => b.type === "text");
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