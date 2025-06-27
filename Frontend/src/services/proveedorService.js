import { supabase } from "../supabase/client";

export const obtenerProveedores = async () => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(`
      id,
      nombre,
      tecnologia,
      color,
      zona_id,
      zonas (
        geom
      )
    `)

  if (error) throw error
  return data
}

export const obtenerProveedorPorId = async (id) => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(`
      id,
      nombre,
      tecnologia,
      color,
      zona_id,
      reseñas:reseñas (
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
