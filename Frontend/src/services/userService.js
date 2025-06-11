/* import { supabase } from "../supabase/client"

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

export const updatePerfil = async (perfilData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        nombre: perfilData.nombre,
        proveedor_preferido: perfilData.proveedor_preferido
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(`Error al actualizar el perfil: ${error.message}`);
  }
};

export const crearPerfil = async ({ nombre, proveedor_preferido }) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw userError;

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    nombre,
    proveedor_preferido: proveedor_preferido || null,
  });

  if (error) throw error;
}; */



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
