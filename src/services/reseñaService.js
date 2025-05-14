import { supabase } from "../supabase/client"

export const obtenerReseñas = async () => {
  const { data, error } = await supabase.from("reseñas").select("*")
  if (error) throw error
  return data
}

export const crearReseña = async (reseña) => {
  const { data, error } = await supabase.from("reseñas").insert(reseña)
  if (error) throw error
  return data
}
