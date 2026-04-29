import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const prompt = `Eres el mejor diseñador de puzzles educativos en español. Crea un puzzle tipo "Connections" sobre "${tema}" nivel ${dificultad}.

PRINCIPIO FUNDAMENTAL DEL PUZZLE:
Las 4 palabras de cada grupo son ejemplos concretos y conocidos de un concepto más amplio. El jugador debe descubrir ese concepto. La satisfacción viene de ir de lo concreto a lo abstracto.

EJEMPLOS DE CÓMO FUNCIONA ESTE PRINCIPIO:

Tema "Animales", nivel fácil:
- Grupo: Perro, Gato, Conejo, Hámster → categoría: "Animales que se tienen como mascotas"
- Grupo: León, Tigre, Cocodrilo, Lobo → categoría: "Animales depredadores salvajes"
- Grupo: Ballena, Tiburón, Pulpo, Delfín → categoría: "Animales que viven en el océano"
- Grupo: Águila, Loro, Paloma, Pingüino → categoría: "Animales que tienen plumas"

Tema "Grandes pensadores", nivel difícil:
- Grupo: Sócrates, Platón, Aristóteles, Epicuro → categoría: "Filósofos de la Grecia antigua"
- Grupo: Da Vinci, Miguel Ángel, Rafael, Botticelli → categoría: "Pintores del Renacimiento italiano"
- Grupo: Napoleón, Alejandro, César, Gengis → categoría: "Conquistadores militares de imperios"
- Grupo: Shakespeare, Cervantes, Dante, Homero → categoría: "Escritores fundadores de su idioma"

Tema "Historia de México", nivel medio:
- Grupo: Hidalgo, Morelos, Guerrero, Allende → categoría: "Héroes de la Independencia mexicana"
- Grupo: Tenochtitlán, Chichén Itzá, Palenque, Teotihuacán → categoría: "Ciudades del México prehispánico"
- Grupo: Oaxaca, Jalisco, Veracruz, Michoacán → categoría: "Estados con gastronomía reconocida mundialmente"
- Grupo: Diego Rivera, Frida Kahlo, José Clemente Orozco, David Siqueiros → categoría: "Muralistas mexicanos del siglo XX"

REGLAS SEGÚN NIVEL:
${dificultad === "fácil" 
? "FÁCIL: Las 16 palabras deben ser conocidas por cualquier niño mexicano de 8 años. Usa animales comunes, objetos cotidianos, personajes de cuentos clásicos, países muy famosos, frutas, colores. PROHIBIDO: nombres científicos, términos técnicos, palabras en inglés, personajes históricos poco conocidos, récords mundiales, especies raras."
: dificultad === "medio" 
? "MEDIO: Las palabras son conocidas para adultos con cultura general de preparatoria. Las categorías requieren conocimiento moderado del tema. Puede incluir personajes históricos famosos, obras conocidas, datos verificables de cultura general."
: "DIFÍCIL: Las palabras son conocidas para expertos o apasionados del tema. Las categorías son conexiones sutiles que requieren conocimiento profundo. Usa datos precisos, periodos históricos específicos, clasificaciones técnicas correctas. El jugador debe sentir que aprendió algo valioso al ver la respuesta."}

REGLAS TÉCNICAS IRRENUNCIABLES:
1. PROHIBIDO absolutamente usar nombres científicos en latín en ningún nivel
2. Las 16 palabras deben ser completamente únicas — ninguna se repite
3. Las categorías deben ser mutuamente excluyentes — ninguna palabra podría pertenecer a otro grupo
4. Cada una de las 4 palabras debe encajar en su categoría por exactamente la misma razón
5. Usa SOLO datos 100% verídicos — si tienes duda de un dato, no lo uses
6. La categoría debe ser el concepto que une a las palabras, no una descripción arbitraria

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
  "pistas": ["pista que orienta sin revelar", "pista que orienta sin revelar", "pista que orienta sin revelar"]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Respuesta inesperada" }, { status: 500 });
    }

    const text = content.text.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "No se encontró JSON" }, { status: 500 });
    }

    const puzzle = JSON.parse(jsonMatch[0]);

    const todasLasPalabras = puzzle.grupos.flatMap(
      (g: { palabras: string[] }) => g.palabras
    );
    const unicas = new Set(todasLasPalabras);
    if (unicas.size !== 16) {
      return NextResponse.json({ error: `Solo ${unicas.size} palabras únicas` }, { status: 500 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}