"use client";
import { useRouter } from "next/navigation";

export default function ComoJugar() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8 pt-4">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-white text-xl">←</button>
          <h1 className="text-2xl font-black">Cómo jugar</h1>
        </div>

        <div className="space-y-3 mb-8">
          <div className="bg-gray-900 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shrink-0">👁️</div>
            <div>
              <h3 className="font-bold mb-1">Lee las 16 palabras</h3>
              <p className="text-gray-400 text-sm">Verás una cuadrícula con 16 conceptos mezclados al azar.</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-xl shrink-0">🔗</div>
            <div>
              <h3 className="font-bold mb-1">Encuentra los 4 grupos</h3>
              <p className="text-gray-400 text-sm">Cada grupo de 4 palabras comparte algo en común: tema, categoría o patrón.</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-yellow-600 flex items-center justify-center text-xl shrink-0">✅</div>
            <div>
              <h3 className="font-bold mb-1">Selecciona y confirma</h3>
              <p className="text-gray-400 text-sm">Toca 4 palabras y presiona Confirmar. Si es correcto, el grupo se revela con su color.</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-xl shrink-0">⚠️</div>
            <div>
              <h3 className="font-bold mb-1">Solo 4 errores permitidos</h3>
              <p className="text-gray-400 text-sm">Si fallas 4 veces, el puzzle se revela. Cuida cada movimiento.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 mb-8">
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">Dificultad de grupos</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm text-gray-300">Más fácil — todos deberían saberlo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
              <span className="text-sm text-gray-300">Fácil — cultura general</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500 shrink-0" />
              <span className="text-sm text-gray-300">Difícil — requiere conocimiento</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500 shrink-0" />
              <span className="text-sm text-gray-300">Muy difícil — para expertos</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900 border border-yellow-700 rounded-2xl p-4 mb-8">
          <p className="text-yellow-100 text-sm">
            💡 <span className="font-bold">Consejo:</span> Cuidado con las palabras trampa que parecen pertenecer a dos grupos diferentes.
          </p>
        </div>

        <button
          onClick={() => router.push("/jugar")}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white hover:opacity-90 transition"
        >
          ¡Entendido, jugar!
        </button>
      </div>
    </main>
  );
}
