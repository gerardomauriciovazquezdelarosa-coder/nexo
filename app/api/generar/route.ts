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
- EJEMPLO BUENO: palabras como Perro, Gato, Conejo, Hámster — NO Turritopsis dohrnii
- Si dudas si un niño conoce la palabra, NO la uses`,
      medio: `NIVEL MEDIO — Para jóvenes y adultos con cultura general:
- Usa palabras conocidas por alguien que fue a la secundaria
- Puede incluir nombres propios famosos, países, personajes históricos conocidos
- Las conexiones requieren pensar un poco pero no son imposibles
- EJEMPLO BUENO: Tiburón blanco, Delfín, Ballena azul, Pulpo`,
      difícil: `NIVEL DIFÍCIL — Para adultos con conocimiento profundo del tema:
- Usa datos muy específicos que solo conoce alguien que estudió el tema
- Puede incluir nombres científicos, récords exactos, datos estadísticos precisos
- Las conexiones son sutiles y requieren conocimiento experto
- EJEMPLO BUENO: Turritopsis dohrnii, Axolote, Celacanto, Nautilo`,
    };

    const nivel = nivelInstrucciones[dificultad as keyof typeof nivelInstrucciones] || nivelInstrucciones["medio"];

    const prompt = `Eres un experto en trivia y puzzles educativos en español.

Crea un puzzle tipo "Connections" sobre: "${tema}".

${nivel}

REGLAS GENERALES:
1. Usa SOLO datos 100% verídicos y verificables
2. Las 16 palabras deben ser completamente ÚNICAS — nunca repitas ninguna
3. Las categorías deben ser MUTUAMENTE EXCLUYENTES — ninguna palabra puede pertenecer a dos grupos
4. Los nombres de categorías deben ser muy específicos para evitar ambigüedad

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
      model: "claude-haiku-4-5-20251001",
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
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}