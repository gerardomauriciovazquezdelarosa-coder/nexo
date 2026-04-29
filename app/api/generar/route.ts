import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    const prompt = `Eres el mejor diseñador de puzzles educativos en español del mundo. Tu misión es crear puzzles tipo "Connections" que sean entretenidos, justos y que produzcan el efecto "¡AH, CLARO!" en el jugador.

TEMA: "${tema}"
NIVEL: ${dificultad}

EL PRINCIPIO FUNDAMENTAL:
Las 4 palabras de cada grupo son ejemplos concretos de un concepto más amplio. El jugador va de lo concreto a lo abstracto. Una buena categoría tiene tres cualidades: es ESPECÍFICA (no vaga), es IRREBATIBLE (cada palabra pertenece por exactamente la misma razón), y produce SATISFACCIÓN al descubrirla.

EL LENGUAJE ES CLAVE:
Usa siempre lenguaje cotidiano y directo, nunca lenguaje de enciclopedia.
- Di "animales que más viven" en lugar de "animales con longevidad extraordinaria"
- Di "pintores que inventaron el Impresionismo" en lugar de "exponentes del movimiento impresionista"
- Di "personajes destruidos por su propia obsesión" en lugar de "arquetipos de la tragedia literaria"

EJEMPLOS PERFECTOS POR NIVEL:

NIVEL FÁCIL (para niños de 8 años, lenguaje cotidiano, palabras que cualquier niño conoce):
Tema "Matemáticas":
- 2+3, 8-3, 10÷2, 1+4 → "Operaciones que dan 5"
- 3×3, 4+5, 18÷2, 15-6 → "Operaciones que dan 9"
- 2×6, 3×4, 24÷2, 8+4 → "Operaciones que dan 12"
- 5×5, 20+5, 100÷4, 30-5 → "Operaciones que dan 25"

Tema "Cuentos clásicos":
- Blancanieves, Cenicienta, La Bella Durmiente, Rapunzel → "Princesas de los cuentos de hadas"
- Lobo feroz, Bruja malvada, Madrastra, Dragón → "Villanos de los cuentos clásicos"
- Caperucita, Pinocho, Pulgarcito, Hansel → "Niños protagonistas de cuentos clásicos"
- Hada madrina, Príncipe, Enano, Genio → "Personajes que ayudan al héroe en los cuentos"

NIVEL MEDIO (para adultos con cultura general):
Tema "Historia de México":
- Hidalgo, Morelos, Allende, Guerrero → "Héroes que lucharon por la Independencia de México"
- Tenochtitlán, Chichén Itzá, Palenque, Teotihuacán → "Ciudades que construyeron los pueblos prehispánicos"
- Diego Rivera, Frida Kahlo, Orozco, Siqueiros → "Pintores mexicanos famosos en todo el mundo"
- Mole, Tacos, Pozole, Chiles en nogada → "Platillos típicos de la cocina mexicana"

Tema "Herramientas y oficios":
- Martillo, Clavo, Serrucho, Formón → "Herramientas que usa el carpintero"
- Bisturí, Estetoscopio, Jeringa, Fórceps → "Instrumentos que usa el médico"
- Pincel, Paleta, Caballete, Espátula → "Herramientas que usa el pintor de cuadros"
- Teclado, Ratón, Pantalla, CPU → "Partes de una computadora"

NIVEL DIFÍCIL (para personas con conocimiento profundo):
Tema "Literatura universal":
- Don Quijote, Hamlet, Raskolnikov, Gatsby → "Personajes de novela destruidos por su propia obsesión"
- Aureliano Buendía, Florentino Ariza, El Coronel, Fermina Daza → "Personajes de novelas de García Márquez"
- Alicia, Pinocho, Peter Pan, El Principito → "Niños de cuentos clásicos que no quieren crecer"
- Romeo, Otelo, Macbeth, El Rey Lear → "Personajes de tragedias de Shakespeare"

Tema "Arte":
- Monet, Renoir, Degas, Pissarro → "Pintores que inventaron el Impresionismo en Francia"
- Picasso, Braque, Léger, Gris → "Pintores que inventaron el Cubismo"
- Dalí, Magritte, Ernst, Miró → "Pintores del movimiento Surrealista"
- Da Vinci, Miguel Ángel, Rafael, Botticelli → "Pintores que vivieron