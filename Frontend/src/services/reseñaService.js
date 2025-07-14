import { supabase } from "../supabase/client";

// Obtener todas las reseñas
export const obtenerReseñas = async () => {
  const { data, error } = await supabase.from("reseñas").select(`
      *,
      user_profiles:usuario_id (
        nombre,
        foto_url
      ),
      proveedores (
        *,
        ProveedorTecnologia (
          tecnologias (*)
        ),
        ZonaProveedor (
          zonas (*)
        )
      )
    `);

  if (error) throw error;
  return data;
};

// Obtener reseñas del usuario autenticado
export const obtenerReseñasUsuario = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .select(
        `
        *,
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        ),
        user_profiles (
          nombre,
          foto_url
        )
      `
      )
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error al obtener reseñas del usuario: ${error.message}`);
  }
};

// Actualizar reseña
export const actualizarReseña = async (id, reseñaData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .update({
        comentario: reseñaData.comentario,
        estrellas: reseñaData.estrellas,
        proveedor_id: reseñaData.proveedor_id,
      })
      .eq("id", id)
      .eq("usuario_id", user.id)
      .select(
        `
        *,
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        )
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error al actualizar reseña: ${error.message}`);
  }
};

// Eliminar reseña
export const eliminarReseña = async (id) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { error } = await supabase
      .from("reseñas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar reseña: ${error.message}`);
  }
};

// Crear reseña
export const crearReseña = async (reseñaData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const datosReseña = {
      comentario: reseñaData.comentario,
      estrellas: reseñaData.estrellas,
      proveedor_id: reseñaData.proveedor_id,
      usuario_id: user.id,
      ubicacion: {
        lat: reseñaData.ubicacion.lat,
        lng: reseñaData.ubicacion.lng,
      },
    };

    const { data: reseñaCompleta, error: insertError } = await supabase
      .from("reseñas")
      .insert([datosReseña])
      .select(
        `
        *,
        user_profiles:usuario_id (
          nombre,
          foto_url
        ),
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        )
      `
      )
      .single();

    if (insertError) throw insertError;

    return reseñaCompleta;
  } catch (error) {
    console.error("❌ Error en crearReseña:", error);
    throw error;
  }
};
