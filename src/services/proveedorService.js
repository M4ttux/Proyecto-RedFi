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