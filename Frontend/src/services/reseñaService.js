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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    const datosReseña = {
      comentario: reseñaData.comentario,
      estrellas: reseñaData.estrellas,
      proveedor_id: reseñaData.proveedor_id,
      usuario_id: user.id,
      ubicacion: {
        lat: reseñaData.ubicacion.lat,
        lng: reseñaData.ubicacion.lng
      },
    };

    // 🔧 Primero insertar
    const { data: insertData, error: insertError } = await supabase
      .from("reseñas")
      .insert([datosReseña])
      .select('id')
      .single();

    if (insertError) {
      console.error("❌ Error insertando:", insertError);
      throw insertError;
    }

    // 🔧 Luego hacer select completo con todas las relaciones
    const { data: reseñaCompleta, error: selectError } = await supabase
      .from("reseñas")
      .select(`
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
      `)
      .eq('id', insertData.id)
      .single();

    if (selectError) {
      console.error("❌ Error obteniendo reseña completa:", selectError);
      throw selectError;
    }

    console.log("✅ Reseña creada exitosamente:", reseñaCompleta);
    return reseñaCompleta;

  } catch (error) {
    console.error("❌ Error en crearReseña:", error);
    throw error;
  }
};
