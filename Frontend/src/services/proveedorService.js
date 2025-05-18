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
        user:user_profiles (
          nombre
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
