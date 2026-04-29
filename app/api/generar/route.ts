import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

// Lista blanca de palabras permitidas en nivel fácil
const PALABRAS_FACILES = new Set([
  "perro","gato","león","tigre","elefante","jirafa","cebra","mono","oso","lobo",
  "zorro","conejo","ratón","caballo","vaca","cerdo","oveja","gallina","pato","águila",
  "loro","paloma","pingüino","cocodrilo","serpiente","rana","tiburón","delfín","ballena",
  "pulpo","mariposa","abeja","hormiga","araña","tortuga","camello","canguro","koala","panda",
  "gorila","leopardo","hipopótamo","rinoceronte","flamenco","tucán","cóndor","jaguar","puma",
  "burro","toro","gallo","pez","cangrejo","medusa","estrella de mar","murciélago","búho","cigüeña"
]);

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    // Intentamos hasta 3 veces para nivel fácil
    const maxIntentos = dificultad === "fácil" ? 3 : 1;

    for (let intento = 0; intento < maxIntentos; intento++) {
      const puzzle = await generarPuzzle(tema, dificultad);
      if (!puzzle) continue;

      // Verificar palabras únicas
      const todas = puzzle.grupos.flatMap((g: { palabras: string[] }) => g.palabras);
      const unicas = new Set(todas);
      if (unicas.size !== 16) continue;

      // Para nivel fácil, verificar que TODAS las palabras estén en la lista blanca
      if (dificultad === "fácil") {
        const palabrasInvalidas = todas.filter(
          (p: string) => !PALABRAS_FACILES.has(p.toLowerCase())
        );
        if (palabrasInvalidas.length > 0) {
          console.log(`Intento ${intento + 1}: palabras inválidas: ${palabrasInvalidas.join(", ")}`);
          continue; // Rechazar y volver a intentar
        }
      }

      return NextResponse.json(puzzle);
    }

    return NextResponse.json({ error: "No se pudo generar un puzzle válido. Intenta de nuevo." }, { status: 500 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function generarPuzzle(tema: string, dificultad: string) {
  try {
    const prompt = `Eres el mejor diseñador de puzzles educativos en español. Tu misión es crear puzzles tipo "Connections" que sean simultáneamente entretenidos, sorprendentes y educativos.

TEMA: "${tema}"
NIVEL: ${dificultad}

EL PRINCIPIO QUE HACE UN PUZZLE MEMORABLE:
Las 4 palabras de cada grupo son ejemplos concretos de un concepto más amplio. El jugador va de lo concreto a lo abstracto. La satisfacción viene del momento "¡AH, CLARO!" — cuando la conexión es sorprendente al principio pero perfectamente obvia al descubrirla.

EJEMPLOS QUE ILUSTRAN ESTE PRINCIPIO:

Para niños (fácil):
- Perro, Gato, Conejo, Hámster → "Animales que vivien en casa con las familias"
- León, Tigre, Lobo, Cocodrilo → "Animales que cazan para comer"  
- Ballena, Tiburón, Delfín, Pulpo → "Animales que viven en el océano"
- Águila, Loro, Paloma, Pingüino → "Animales que tienen plumas"

Para adultos (medio):
- Sócrates, Platón, Aristóteles, Epicuro → "Filósofos que vivieron en la Grecia antigua"
- Da Vinci, Miguel Ángel, Rafael, Botticelli → "Pintores del Renacimiento italiano"
- Hidalgo, Morelos, Guerrero, Allende → "Héroes de la Independencia de México"
- Martillo, Destornillador, Llave, Serrucho → "Herramientas de carpintería"

Para expertos (difícil):
- Quijote, Hamlet, Raskolnikov, Gatsby → "Protagonistas masculinos consumidos por una obsesión"
- Aureliano Buendía, Florentino Ariza, Santiago Nasar, El Coronel → "Personajes de novelas de García Márquez"
- y=2x+1, y=-3x+5, y=x, y=7 → "Ecuaciones que forman una línea recta"

${dificultad === "fácil" 
? `NIVEL FÁCIL — REGLA ABSOLUTA:
Usa ÚNICAMENTE estos animales u objetos que cualquier niño mexicano de 8 años conoce perfectamente:
Perro, Gato, León, Tigre, Elefante, Jirafa, Cebra, Mono, Oso, Lobo, Zorro, Conejo, Ratón, Caballo, Vaca, Cerdo, Oveja, Gallina, Pato, Águila, Loro, Paloma, Pingüino, Cocodrilo, Serpiente, Rana, Tiburón, Delfín, Ballena, Pulpo, Mariposa, Abeja, Tortuga, Camello, Canguro, Panda, Gorila, Leopardo, Hipopótamo, Jaguar, Puma, Toro, Gallo, Murciélago, Búho.
SOLO puedes usar palabras de esa lista. Si el tema requiere otras palabras, elige las más cercanas de esa lista.`
: dificultad === "medio"
? `NIVEL MEDIO: Palabras conocidas para adultos mexicanos con cultura general. Las categorías requieren pensar pero son justas. PROHIBIDO: nombres científicos en latín, especies raras o poco conocidas.`
: `NIVEL DIFÍCIL: Conexiones sutiles para expertos. Datos precisos, clasificaciones técnicas, conexiones literarias o históricas profundas. El jugador debe sentir que aprendió algo valioso.`}

REGLAS TÉCNICAS:
1. PROHIBIDO ABSOLUTO en cualquier nivel: nombres científicos en latín (Turritopsis, Fennec, Borealis, etc.)
2. Las 16 palabras deben ser completamente únicas
3. Las categorías deben ser mutuamente excluyentes
4. Cada palabra debe pertenecer a su grupo por exactamente la misma razón que las otras tres
5. Solo datos 100% verídicos

Responde SOLO con JSON válido, sin markdown, sin backticks, sin texto adicional:
{
  "tema": "nombre del tema",
  "dificultad": "${dificultad}",
  "grupos": [
    {"categoria": "concepto que une las 4 palabras", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#22c55e", "emoji": "🟢"},
    {"categoria": "concepto que une las 4 palabras", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#3b82f6", "emoji": "🔵"},
    {"categoria": "concepto que une las 4 palabras", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#f59e0b", "emoji": "🟡"},
    {"categoria": "concepto que une las 4 palabras", "palabras": ["palabra1","palabra2","palabra3","palabra4"], "color": "#ef4444", "emoji": "🔴"}
  ],
  "pistas": ["pista que orienta sin revelar la respuesta", "pista que orienta sin revelar la respuesta", "pista que orienta sin revelar la respuesta"]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") return null;

    const text = content.text.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}