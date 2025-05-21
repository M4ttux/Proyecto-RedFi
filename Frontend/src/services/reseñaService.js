import { supabase } from "../supabase/client"

export const obtenerReseñas = async () => {
  const { data, error } = await supabase
    .from("reseñas")
    .select(`
      id,
      comentario,
      estrellas,
      proveedor_id,
      usuario_id,
      user_profiles:usuario_id (
        nombre
      ),
      proveedores (
        nombre,
        zona_id,
        tecnologia,
        zonas ( geom )
      )
    `);

  if (error) throw error;
  return data;
};




export const crearReseña = async (reseña) => {
  const { data, error } = await supabase.from("reseñas").insert(reseña)
  if (error) throw error
  return data
}
