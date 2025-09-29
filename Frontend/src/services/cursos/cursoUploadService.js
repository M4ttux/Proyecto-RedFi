import { supabase } from "../../supabase/client";

/**
 * Servicio para manejo de archivos y uploads de cursos
 */

/**
 * Sube una miniatura al storage de Supabase
 */
export const subirMiniatura = async (miniaturaFile, mostrarAlerta = () => {}) => {
  try {
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

    return publicUrl;
  } catch (error) {
    console.error("Error al subir miniatura:", error);
    mostrarAlerta("Error al subir la miniatura.");
    throw new Error("Error al subir la miniatura");
  }
};

/**
 * Elimina una miniatura del storage
 */
export const eliminarMiniatura = async (miniaturaUrl, mostrarAlerta = () => {}) => {
  try {
    // Extraer el path de la URL
    const url = new URL(miniaturaUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-3).join('/'); // cursos/miniaturas/filename

    const { error } = await supabase.storage
      .from("cursos")
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error al eliminar miniatura:", error);
    mostrarAlerta("Error al eliminar la miniatura anterior.");
    // No lanzar error aquí para no bloquear otras operaciones
    return false;
  }
};

/**
 * Actualiza la miniatura (elimina la anterior y sube la nueva)
 */
export const actualizarMiniatura = async (miniaturaAnterior, nuevaMiniatura, mostrarAlerta = () => {}) => {
  try {
    let nuevaUrl = null;

    // Subir nueva miniatura
    if (nuevaMiniatura) {
      nuevaUrl = await subirMiniatura(nuevaMiniatura, mostrarAlerta);
    }

    // Eliminar miniatura anterior (si existe y se subió una nueva)
    if (miniaturaAnterior && nuevaUrl) {
      await eliminarMiniatura(miniaturaAnterior, mostrarAlerta);
    }

    return nuevaUrl || miniaturaAnterior;
  } catch (error) {
    console.error("Error al actualizar miniatura:", error);
    mostrarAlerta("Error al actualizar la miniatura.");
    throw new Error("Error al actualizar la miniatura");
  }
};