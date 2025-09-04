import { createClient } from '@supabase/supabase-js'

// Inicializa el cliente de Supabase usando variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar que las variables estén configuradas
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL no está configurada');
  throw new Error('Falta la URL de Supabase');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY no está configurada');
  throw new Error('Falta la clave anónima de Supabase');
}

console.log('✅ Configuración de Supabase correcta');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
