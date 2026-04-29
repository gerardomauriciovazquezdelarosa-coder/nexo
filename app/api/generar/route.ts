import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const nivelInstrucciones = {
      fácil: "conexiones muy obvias y palabras conocidas por cualquier persona, incluso niños",
      medio: "conexiones que requieren conocimiento general del tema",
      difícil: "conexiones sutiles y datos muy específicos que solo conoce un experto",
    };

    const nivel = nivelInstrucciones[dificultad as keyof typeof nivelInstrucciones] || nivelInstrucciones["medio"];

    const prompt = `Eres un experto en trivia y puzzles educativos en español con acceso a información verificada.

Crea un puzzle tipo "Connections" sobre: "${tema}" con dificultad: ${dificultad} (${nivel}).

REGLAS CRÍTICAS:
1. USA SOLO datos 100% verídicos — si no estás seguro de un dato, no lo uses
2. Las 16 palabras deben ser completamente ÚNICAS — nunca repitas ninguna
3. Las categorías deben ser MUTUAMENTE EXCLUYENTES — ninguna palabra puede pertenecer lógicamente a dos grupos
4. Si una palabra podría encajar en dos grupos, cámbiala por otra más específica
5. Las categorías deben tener nombres muy específicos para evitar ambigüedad
6. Para nivel DIFÍCIL: usa datos muy específicos como años exactos, récords precisos, datos estadísticos — NO uses categorías genéricas
7. Para nivel FÁCIL: usa palabras y conexiones que cualquier niño pueda entender

VERIFICA antes de responder:
- ¿Todas las palabras son 100% correctas y verificables?
- ¿Hay alguna palabra duplicada?
- ¿Podría alguna palabra pertenecer a más de un grupo?

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
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Error");

    const text = content.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const puzzle = JSON.parse(jsonMatch[0]);

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