// Copia este archivo como "config.js" (en la misma carpeta) y rellena tus
// credenciales del proyecto de Supabase. NO renombres las variables.
//
// La "anon key" de Supabase está pensada para usarse en el cliente: no es un
// secreto. La seguridad real de los datos la da Row Level Security (RLS),
// definido en supabase/schema.sql. Aun así, config.js está en .gitignore para
// que no dependas de recordar borrar tus valores antes de un commit.
//
// En el despliegue automático a GitHub Pages (.github/workflows/deploy.yml)
// este archivo se genera solo a partir de los Secrets del repositorio, así
// que no hace falta subirlo a mano.

export const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
export const SUPABASE_ANON_KEY = 'TU-ANON-KEY-PUBLICA';
