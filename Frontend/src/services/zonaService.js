// src/services/zonas.js
import { supabase } from "../supabase/client";

export const getZonas = async () => {
  const { data, error } = await supabase.from("zonas").select("*").order("departamento", { ascending: true });
  if (error) {
    console.error("Error al cargar zonas:", error);
    return [];
  }
  return data;
};
