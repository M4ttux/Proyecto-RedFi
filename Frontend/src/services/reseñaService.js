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
    console.log("📤 Creando reseña en Supabase:", reseñaData);

    // 🔧 Obtener usuario actual (si tienes autenticación)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    // 🔧 Preparar datos con coordenadas en formato JSON
    const datosReseña = {
      comentario: reseñaData.comentario,
      estrellas: reseñaData.estrellas,
      proveedor_id: reseñaData.proveedor_id,
      usuario_id: user.id,
      ubicacion: {
        lat: reseñaData.ubicacion.lat,
        lng: reseñaData.ubicacion.lng,
      }, // 🔧 Guardar como objeto JSON
    };

    console.log("📋 Datos preparados para insertar:", datosReseña);

    const { data, error } = await supabase
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
          tecnologia
        )
      `
      )
      .single();

    if (error) {
      console.error("❌ Error de Supabase:", error);
      throw error;
    }

    console.log("✅ Reseña creada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en crearReseña:", error);
    throw error;
  }
};
