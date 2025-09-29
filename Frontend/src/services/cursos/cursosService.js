import { supabase } from "../../supabase/client";

/**
 * Obtiene todos los cursos disponibles
 */
export const obtenerCursos = async () => {
  try {
    console.log("Iniciando obtenerCursos...");
    const { data, error } = await supabase
      .from("cursos")
      .select("*")

    console.log("Respuesta de Supabase - data:", data, "error:", error);

    if (error) {
      // Si la tabla no existe, devolver array vacío en lugar de error
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Tabla 'cursos' no existe, devolviendo array vacío");
        return [];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    // En lugar de lanzar error, devolver array vacío para evitar loops
    console.warn("Devolviendo array vacío debido a error en obtenerCursos");
    return [];
  }
};

/**
 * Obtiene un curso específico por ID
 */
export const obtenerCursoPorId = async (cursoId) => {
  try {
    console.log("Buscando curso con ID:", cursoId);
    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .eq("id", cursoId)
      .single();

    console.log("Respuesta obtenerCursoPorId - data:", data, "error:", error);

    if (error) {
      // Si es error de "not found", devolver null en lugar de lanzar error
      if (error.code === "PGRST116" || error.message?.includes("no rows")) {
        console.log("Curso no encontrado con ID:", cursoId);
        return null;
      }
      // Si la tabla no existe, devolver null
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.warn("Tabla 'cursos' no existe");
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener curso:", error);
    throw new Error("Error al cargar el curso");
  }
};

/**
 * Crea un nuevo curso
 */
export const crearCurso = async (cursoData, miniaturaFile) => {
  try {
    let miniaturaUrl = null;

    // Subir miniatura si se proporciona
    if (miniaturaFile) {
      const fileExt = miniaturaFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cursos/miniaturas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cursos")
        .upload(filePath, miniaturaFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("cursos")
        .getPublicUrl(filePath);

      miniaturaUrl = publicUrl;
    }

    // Crear curso
    const { data, error } = await supabase
      .from("cursos")
      .insert([{
        titulo: cursoData.titulo,
        descripcion: cursoData.descripcion,
        video_youtube_url: cursoData.video_youtube_url,
        miniatura_url: miniaturaUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al crear curso:", error);
    throw new Error("Error al crear el curso");
  }
};

/**
 * Actualiza un curso existente
 */
export const actualizarCurso = async (cursoId, cursoData, miniaturaFile) => {
  try {
    let miniaturaUrl = cursoData.miniatura_url;

    // Subir nueva miniatura si se proporciona
    if (miniaturaFile) {
      const fileExt = miniaturaFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cursos/miniaturas/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cursos")
        .upload(filePath, miniaturaFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("cursos")
        .getPublicUrl(filePath);

      miniaturaUrl = publicUrl;
    }

    // Actualizar curso
    const { data, error } = await supabase
      .from("cursos")
      .update({
        titulo: cursoData.titulo,
        descripcion: cursoData.descripcion,
        video_youtube_url: cursoData.video_youtube_url,
        miniatura_url: miniaturaUrl
      })
      .eq("id", cursoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    throw new Error("Error al actualizar el curso");
  }
};

/**
 * Elimina un curso
 */
export const eliminarCurso = async (cursoId) => {
  try {
    const { error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", cursoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw new Error("Error al eliminar el curso");
  }
};

/**
 * Valida el archivo de miniatura
 */
export const validarMiniatura = (file) => {
  const errors = [];
  
  // Validar tamaño (máximo 100KB)
  if (file.size > 100 * 1024) {
    errors.push("La miniatura no puede pesar más de 100KB");
  }
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    errors.push("El archivo debe ser una imagen");
  }
  
  // Validar formato
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push("Solo se permiten archivos JPG, PNG o WebP");
  }
  
  return errors;
};

/**
 * Valida las dimensiones de la imagen
 */
export const validarDimensionesImagen = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const errors = [];
      if (img.width > 500 || img.height > 500) {
        errors.push("La resolución máxima permitida es 500x500 píxeles");
      }
      resolve(errors);
    };
    img.onerror = () => {
      resolve(["Error al cargar la imagen"]);
    };
    img.src = URL.createObjectURL(file);
  });
};