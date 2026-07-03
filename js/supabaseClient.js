// Cliente único de Supabase, importado como módulo ES desde un CDN (esm.sh).
// No usamos npm/bundler: esto tiene que poder servirse como archivos estáticos
// en GitHub Pages sin ningún paso de compilación.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // necesario para que funcione el magic link
  },
});
