import { supabase } from "../supabase/client";

export const obtenerReseñas = async () => {
  const { data, error } = await supabase.from("reseñas").select(`
      id,
      comentario,
      estrellas,
      proveedor_id,
      usuario_id,
      ubicacion,
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

// 🔧 Función corregida para guardar coordenadas como JSON
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
          nombre
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
