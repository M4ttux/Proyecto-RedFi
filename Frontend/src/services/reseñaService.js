import { supabase } from "../supabase/client";

// Funcion para obtener todas las reseñas
export const obtenerReseñas = async () => {
  const { data, error } = await supabase.from("reseñas").select(`
      id,
      comentario,
      estrellas,
      proveedor_id,
      usuario_id,
      ubicacion,
      user_profiles:usuario_id (
        nombre,
        foto_url
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

// Funcion para obtener las reseñas del usuario autenticado
export const obtenerReseñasUsuario = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .select(`
        id,
        comentario,
        estrellas,
        proveedor_id,
        usuario_id,
        ubicacion,
        created_at,
        proveedores (
          nombre,
          tecnologia
        )
      `)
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error al obtener reseñas del usuario: ${error.message}`);
  }
};

// Función para actualizar una reseña
export const actualizarReseña = async (id, reseñaData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .update({
        comentario: reseñaData.comentario,
        estrellas: reseñaData.estrellas,
        proveedor_id: reseñaData.proveedor_id,
      })
      .eq("id", id)
      .eq("usuario_id", user.id) // Asegurar que solo pueda editar sus propias reseñas
      .select(`
        id,
        comentario,
        estrellas,
        proveedor_id,
        usuario_id,
        ubicacion,
        created_at,
        proveedores (
          nombre,
          tecnologia
        )
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error al actualizar reseña: ${error.message}`);
  }
};

// Función para eliminar una reseña
export const eliminarReseña = async (id) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { error } = await supabase
      .from("reseñas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", user.id); // Asegurar que solo pueda eliminar sus propias reseñas

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar reseña: ${error.message}`);
  }
};

// Función para crear reseñas
export const crearReseña = async (reseñaData) => {
  try {
    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    // 🔎 Intentar obtener el nombre del usuario desde user_profiles
    const { data: perfil, error: perfilError } = await supabase
      .from("user_profiles")
      .select("nombre")
      .eq("id", user.id)
      .single();

    if (perfilError) {
      console.warn(
        "⚠️ No se pudo obtener nombre desde user_profiles:",
        perfilError
      );
    }

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

    // Insertar y recuperar con relaciones
    const { data: reseñaCompleta, error: insertError } = await supabase
      .from("reseñas")
      .insert([datosReseña])
      .select(
        `
        id,
        comentario,
        estrellas,
        proveedor_id,
        usuario_id,
        ubicacion,
        user_profiles:usuario_id (
          nombre,
          foto_url
        ),
        proveedores (
          nombre,
          zona_id,
          tecnologia,
          zonas ( geom )
        )
      `
      )
      .single();

    if (insertError) {
      console.error("❌ Error insertando reseña:", insertError);
      throw insertError;
    }

    console.log("🧪 Reseña completa con relaciones Supabase:", reseñaCompleta);


    return reseñaCompleta;
  } catch (error) {
    console.error("❌ Error en crearReseña:", error);
    throw error;
  }
};
