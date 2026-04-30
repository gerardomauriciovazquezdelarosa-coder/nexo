import { createClient } from '@supabase/supabase-js';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

const SUPABASE_URL = 'https://mokznerldaewdjscokjg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2ebLTBUpprXQc1kYvw3FNw_MCLiiGyC';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const workbook = readFile('scripts/NEXO_Base_Puzzles_v16.xlsx');
let total = 0;
let errores = 0;

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const rows = utils.sheet_to_json(sheet);
  
  for (const row of rows) {
    const tema = row['Categoría Temática'];
    const nivel = row['Nivel'];
    const titulo = row['Título del Grupo'];
    const palabra1 = row['Palabra 1'];
    const palabra2 = row['Palabra 2'];
    const palabra3 = row['Palabra 3'];
    const palabra4 = row['Palabra 4'];

    if (!tema || !nivel || !titulo || !palabra1) continue;

    const { error } = await supabase.from('puzzles').insert({
      tema: String(tema),
      nivel: String(nivel),
      titulo: String(titulo),
      palabra1: String(palabra1),
      palabra2: String(palabra2),
      palabra3: String(palabra3),
      palabra4: String(palabra4),
    });

    if (error) {
      console.error('Error:', error.message, row);
      errores++;
    } else {
      total++;
    }
  }
  console.log(`✅ Hoja "${sheetName}" importada`);
}

console.log(`\nTotal importados: ${total}, Errores: ${errores}`);