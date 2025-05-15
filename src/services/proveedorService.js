import { supabase } from "../supabase/client";

export const obtenerProveedores = async () => {
  const { data, error } = await supabase.from("proveedores").select("*");
  if (error) throw error;
  return data;
};
