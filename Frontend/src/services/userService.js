import { supabase } from "../supabase/client"

export const getPerfil = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  if (error) throw error
  return data
}

export const updatePerfil = async (fields) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("user_profiles")
    .update(fields)
    .eq("id", user.id)
  if (error) throw error
  return data
}

export const crearPerfil = async ({ nombre, proveedor_preferido }) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw userError;

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    nombre,
    proveedor_preferido: proveedor_preferido || null,
  });

  if (error) throw error;
};

