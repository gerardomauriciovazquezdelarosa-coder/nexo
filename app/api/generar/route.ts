import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const prompt = `Eres el diseñador de puzzles más creativo e inteligente del mundo hispanohablante. Tu especialidad es crear puzzles tipo "Connections" que producen el efecto "¡ah, claro!" — donde la conexión es sorprendente al principio pero perfectamente obvia una vez descubierta.

TEMA: "${tema}"
NIVEL: ${dificultad}

FILOSOFÍA DEL BUEN PUZZLE:
Una categoría excelente tiene TRES propiedades simultáneas:
1. Es ESPECÍFICA: "Animales que aparecen en billetes mexicanos" es mejor que "Animales famosos"
2. Es IRREBATIBLE: cada palabra pertenece al grupo por exactamente la misma razón, sin excepciones ni "casi"
3. Produce el efecto "¡AH, CLARO!": cuando el jugador descubre la conexión, la reconoce como elegante y justa

EJEMPLOS DE CATEGORÍAS EXCELENTES vs MALAS:
❌ MALA: "Animales grandes" — subjetivo, discutible, aburrido
✅ BUENA: "Animales que aparecen en el escudo nacional de México" — específico, irrebatible, sorprendente

❌ MALA: "Animales rápidos" — ¿rápidos comparado con qué?
✅ BUENA: "Animales más rápidos que un auto en autopista (>120 km/h)" — específico, verificable, produce asombro

❌ MALA: "Animales del mar" — demasiado obvia, no hay descubrimiento
✅ BUENA: "Animales marinos que pueden matar a un humano" — tiene tensión, es sorprendente, es irrebatible

❌ MALA: "Cosas relacionadas con el espacio" — demasiado amplia
✅ BUENA: "Objetos que han estado en la Luna" — específico, sorprendente, irrebatible

REGLAS SEGÚN NIVEL:
${dificultad === "fácil" ? `FÁCIL: Las 16 palabras deben ser conocidas por cualquier niño de primaria. Las categorías deben ser claras una vez descubiertas, pero no inmediatamente obvias. Usa palabras cotidianas: animales comunes, colores, objetos del hogar, personajes de cuentos. PROHIBIDO: nombres científicos, términos técnicos, palabras en inglés, datos históricos específicos.` : dificultad === "medio" ? `MEDIO: Las palabras son conocidas para adultos con cultura general. Las categorías requieren pensar y conocimiento moderado del tema. Puede incluir datos conocidos, personajes famosos, lugares reconocibles.` : `DIFÍCIL: Las categorías son conexiones no obvias que solo descubre alguien con conocimiento profundo del tema. Usa datos precisos, récords específicos, hechos poco conocidos pero verificables. El jugador debe sentir que aprendió algo al ver la respuesta.`}

REGLAS TÉCNICAS IRRENUNCIABLES:
1. Verifica mentalmente que cada palabra pertenece a su categoría por EXACTAMENTE la misma razón que las otras tres
2. Si una palabra "casi" encaja, NO la uses — busca una que encaje perfectamente
3. Las 16 palabras deben ser completamente únicas — ninguna se repite
4. Las categorías deben ser mutuamente excluyentes — ninguna palabra podría pertenecer a otro grupo
5. Antes de responder, pregúntate: "¿Podría un jugador justo reclamar que esta palabra no pertenece aquí?" Si la respuesta es sí, cambia la palabra
6. Usa SOLO datos 100% verídicos y verificables

Responde SOLO con este JSON válido, sin texto adicional, sin markdown, sin backticks:
{
  "tema": "nombre del tema",
  "dificultad": "${dificultad}",
  "grupos": [
    {"categoria": "categoria muy específica e ingeniosa", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#22c55e", "emoji": "🟢"},
    {"categoria": "categoria muy específica e ingeniosa", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#3b82f6", "emoji": "🔵"},
    {"categoria": "categoria muy específica e ingeniosa", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#f59e0b", "emoji": "🟡"},
    {"categoria": "categoria muy específica e ingeniosa", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#ef4444", "emoji": "🔴"}
  ],
  "pistas": ["pista ingeniosa 1", "pista ingeniosa 2", "pista ingeniosa 3"]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Respuesta no es texto: " + content.type }, { status: 500 });
    }

    const text = content.text.trim();
    const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "No JSON encontrado" }, { status: 500 });
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
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}