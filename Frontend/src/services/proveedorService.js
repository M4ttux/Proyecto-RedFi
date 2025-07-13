import { supabase } from "../supabase/client";

// Obtener todos los proveedores con tecnologías y zonas
export const obtenerProveedores = async () => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(`
      *,
      ProveedorTecnologia (
        tecnologias (*)
      ),
      ZonaProveedor (
        zonas (*)
      )
    `)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
};

// Obtener un proveedor por ID con sus reseñas y tecnologías
export const obtenerProveedorPorId = async (id) => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(`
      *,
      ProveedorTecnologia (
        tecnologias (*)
      ),
      reseñas (
        comentario,
        estrellas,
        created_at,
        user:user_profiles (
          nombre,
          foto_url
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
