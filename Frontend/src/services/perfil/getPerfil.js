import { supabase } from "../../supabase/client";

// Obtener perfil extendido del usuario logueado
export const getPerfil = async (mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    mostrarAlerta("Error al obtener el perfil.");
    throw error;
  }
  return data;
};
