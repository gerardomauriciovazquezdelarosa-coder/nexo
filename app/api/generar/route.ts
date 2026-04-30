import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { tema, dificultad } = await request.json();

    // Obtener todas las filas del tema y nivel
    const { data: filas, error } = await supabase
      .from('puzzles')
      .select('*')
      .eq('tema', tema)
      .eq('nivel', dificultad);

    if (error) throw new Error(error.message);
    if (!filas || filas.length < 4) {
      return NextResponse.json({ error: 'No hay suficientes puzzles para este tema y nivel' }, { status: 404 });
    }

    // Mezclar las filas aleatoriamente y tomar 4
    const mezcladas = filas.sort(() => Math.random() - 0.5);
    const seleccionadas = mezcladas.slice(0, 4);

    const colores = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    const emojis = ['🟢', '🔵', '🟡', '🔴'];

    const grupos = seleccionadas.map((fila, i) => ({
      categoria: fila.titulo,
      palabras: [fila.palabra1, fila.palabra2, fila.palabra3, fila.palabra4],
      color: colores[i],
      emoji: emojis[i],
    }));

    // Verificar 16 palabras únicas
    const todas = grupos.flatMap(g => g.palabras);
    const unicas = new Set(todas);
    if (unicas.size !== 16) {
      return NextResponse.json({ error: 'Palabras duplicadas en el puzzle' }, { status: 500 });
    }

    return NextResponse.json({
      tema,
      dificultad,
      grupos,
      pistas: [
        `Hay grupos relacionados con ${tema}`,
        'Piensa en qué tienen en común cada grupo de 4',
        'Algunos grupos son más específicos que otros',
      ],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}