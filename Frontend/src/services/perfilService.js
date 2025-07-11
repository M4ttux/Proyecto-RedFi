// src/services/perfilService.js
import { supabase } from "../supabase/client";

// Obtener perfil extendido del usuario logueado
export const getPerfil = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar perfil
export const updatePerfil = async (fields) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError;

  const { data, error } = await supabase
    .from("user_profiles")
    .update(fields)
    .eq("id", user.id);

  if (error) throw error;
  return data;
};

// Crear perfil inicial tras el registro
export const crearPerfil = async ({ nombre, proveedor_preferido }) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError;

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    nombre,
    proveedor_preferido: proveedor_preferido || null,
  });

  if (error) throw error;
};

// Actualizar perfil y foto
export const updatePerfilYFoto = async ({
  nombre,
  proveedor_preferido,
  foto,
  preview,
  eliminarFoto = false,
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Error al obtener el usuario.");

  // Validación de nombre
  if (!nombre || nombre.trim().length < 2) {
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const caracteresInvalidos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/;
  if (emojiRegex.test(nombre) || caracteresInvalidos.test(nombre)) {
    throw new Error("El nombre contiene caracteres no permitidos.");
  }

  let nuevaUrl = preview;

  const perfilActual = await getPerfil();
  const urlAntigua = perfilActual.foto_url;
  const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
    .data.publicUrl;

  if (eliminarFoto && urlAntigua && urlAntigua.startsWith(bucketUrl)) {
    const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
    await supabase.storage.from("perfiles").remove([rutaAntigua]);
    nuevaUrl = null;
  }

  if (foto) {
    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(foto.type)) {
      throw new Error("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
    }

    // Validar tamaño
    const MAX_TAMANO_BYTES = 300 * 1024;
    if (foto.size > MAX_TAMANO_BYTES) {
      throw new Error("La imagen supera los 300 KB permitidos.");
    }

    // Validar resolución
    const imagenValida = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 500 || img.height > 500) {
          reject(
            new Error("La resolución máxima permitida es 500x500 píxeles.")
          );
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(new Error("No se pudo procesar la imagen."));
      img.src = URL.createObjectURL(foto);
    });

    if (!imagenValida) throw new Error("La imagen no es válida.");

    const urlAntigua = perfilActual.foto_url;
    const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
      .data.publicUrl;

    if (urlAntigua && urlAntigua.startsWith(bucketUrl)) {
      const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
      await supabase.storage.from("perfiles").remove([rutaAntigua]);
    }

    // 🆕 Subir nueva imagen
    const carpetaUsuario = `${user.id}`;
    const nombreArchivo = `perfil-${Date.now()}`;
    const rutaCompleta = `${carpetaUsuario}/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("perfiles")
      .upload(rutaCompleta, foto, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw new Error("Error al subir la imagen al servidor.");

    const { data } = supabase.storage
      .from("perfiles")
      .getPublicUrl(rutaCompleta);
    nuevaUrl = data.publicUrl;
  }

  // 🧠 Actualizar metadata en auth
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      name: nombre,
      foto_perfil: nuevaUrl,
    },
  });
  if (authError) throw new Error("Error al actualizar los datos del usuario.");

  // 🧠 Actualizar en tabla personalizada
  const { error: perfilError } = await supabase
    .from("user_profiles")
    .update({
      nombre,
      proveedor_preferido,
      foto_url: nuevaUrl,
    })
    .eq("id", user.id);

  if (perfilError)
    throw new Error("Error al guardar los datos en la base de datos.");
};
