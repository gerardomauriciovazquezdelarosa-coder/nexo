import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const nivelInstrucciones = {
      fácil: `NIVEL FÁCIL — Para niños de 8 a 12 años:
- Usa SOLO palabras que un niño de primaria conoce
- PROHIBIDO: nombres científicos, términos técnicos, palabras en otro idioma
- Las palabras deben ser de uso cotidiano: perro, gato, león, águila
- Las categorías deben ser obvias: "Animales domésticos", "Animales de la selva"
- EJEMPLO BUENO: palabras como Perro, Gato, Conejo, Hámster
- Si dudas si un niño conoce la palabra, NO la uses`,
      medio: `NIVEL MEDIO — Para jóvenes y adultos con cultura general:
- Usa palabras conocidas por alguien que fue a la secundaria
- Puede incluir nombres propios famosos, países, personajes históricos conocidos`,
      difícil: `NIVEL DIFÍCIL — Para adultos con conocimiento profundo del tema:
- Usa datos muy específicos que solo conoce alguien que estudió el tema
- Puede incluir nombres científicos, récords exactos, datos estadísticos precisos`,
    };

    const nivel = nivelInstrucciones[dificultad as keyof typeof nivelInstrucciones] || nivelInstrucciones["medio"];

    const prompt = `Eres un experto en trivia y puzzles educativos en español.

Crea un puzzle tipo "Connections" sobre: "${tema}".

${nivel}

REGLAS:
1. Las 16 palabras deben ser completamente ÚNICAS
2. Las categorías deben ser MUTUAMENTE EXCLUYENTES

Responde SOLO con este JSON válido, sin texto adicional, sin markdown, sin backticks:
{
  "tema": "nombre del tema",
  "dificultad": "${dificultad}",
  "grupos": [
    {"categoria": "categoria 1", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#22c55e", "emoji": "🟢"},
    {"categoria": "categoria 2", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#3b82f6", "emoji": "🔵"},
    {"categoria": "categoria 3", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#f59e0b", "emoji": "🟡"},
    {"categoria": "categoria 4", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#ef4444", "emoji": "🔴"}
  ],
  "pistas": ["pista 1", "pista 2", "pista 3"]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Respuesta no es texto: " + content.type }, { status: 500 });
    }

    const text = content.text.trim();
    console.log("Respuesta IA:", text.substring(0, 200));

    // Limpiar posibles backticks o markdown
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "No JSON encontrado en: " + cleanText.substring(0, 100) }, { status: 500 });
    }

    const puzzle = JSON.parse(jsonMatch[0]);

    const todasLasPalabras = puzzle.grupos.flatMap(
      (g: { palabras: string[] }) => g.palabras
    );
    const unicas = new Set(todasLasPalabras);
    if (unicas.size !== 16) {
      return NextResponse.json({ error: `Solo ${unicas.size} palabras únicas de 16` }, { status: 500 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error completo:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}