import { supabase } from "../supabase/client";

// Obtener todas las tecnologías
export const obtenerTecnologias = async () => {
  const { data, error } = await supabase.from("tecnologias").select("*");
  if (error) throw error("Error al obtener tecnologías");
  return data;
};

// Agregar una nueva tecnología
