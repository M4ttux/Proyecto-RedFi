import { supabase } from "../../supabase/client";
import { subirMiniatura, actualizarMiniatura } from "./cursoUploadService";

/**
 * Servicio principal para operaciones CRUD de cursos
 */

/**
 * Obtiene todos los cursos disponibles
 */
export const obtenerCursos = async (mostrarAlerta = () => {}) => {
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
      mostrarAlerta("Error al obtener los cursos.");
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    mostrarAlerta("Error inesperado al cargar los cursos.");
    // En lugar de lanzar error, devolver array vacío para evitar loops
    console.warn("Devolviendo array vacío debido a error en obtenerCursos");
    return [];
  }
};

/**
 * Obtiene un curso específico por ID
 */
export const obtenerCursoPorId = async (cursoId, mostrarAlerta = () => {}) => {
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
    mostrarAlerta("Error al cargar el curso.");
    throw new Error("Error al cargar el curso");
  }
};

/**
 * Crea un nuevo curso
 */
export const crearCurso = async (cursoData, miniaturaFile, mostrarAlerta = () => {}) => {
  try {
    let miniaturaUrl = null;

    // Subir miniatura si se proporciona
    if (miniaturaFile) {
      miniaturaUrl = await subirMiniatura(miniaturaFile, mostrarAlerta);
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
    mostrarAlerta("Error al crear el curso.");
    throw new Error("Error al crear el curso");
  }
};

/**
 * Actualiza un curso existente
 */
export const actualizarCurso = async (cursoId, cursoData, miniaturaFile, mostrarAlerta = () => {}) => {
  try {
    const miniaturaUrl = await actualizarMiniatura(cursoData.miniatura_url, miniaturaFile, mostrarAlerta);

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
    mostrarAlerta("Error al actualizar el curso.");
    throw new Error("Error al actualizar el curso");
  }
};

/**
 * Elimina un curso
 */
export const eliminarCurso = async (cursoId, mostrarAlerta = () => {}) => {
  try {
    const { error } = await supabase
      .from("cursos")
      .delete()
      .eq("id", cursoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    mostrarAlerta("Error al eliminar el curso.");
    throw new Error("Error al eliminar el curso");
  }
};

