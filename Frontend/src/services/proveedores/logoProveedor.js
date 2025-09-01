import { supabase } from "../../supabase/client";

// subirLogoProveedor - Usa ID del proveedor para evitar problemas con cambios de nombre
export const subirLogoProveedor = async (proveedorId, file) => {
  // Usar directamente el ID sin transformaciones
  const timestamp = Date.now();
  const path = `proveedor-${proveedorId}/logo-${timestamp}.png`;

  console.log("📤 Subiendo logo en ruta:", path);
  console.log("📄 Archivo recibido:", file);

  const { error: uploadError } = await supabase.storage
    .from("proveedores")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false, // Crear archivo único
      contentType: file?.type || "image/png",
    });

  if (uploadError) {
    console.error("❌ Error al subir logo:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from("proveedores").getPublicUrl(path);
  return data.publicUrl;
};

// Eliminar logo de proveedor desde el bucket usando ID
export const eliminarLogoProveedor = async (proveedorId) => {
  const folderPath = `proveedor-${proveedorId}`;

  // Listar todos los archivos en la carpeta del proveedor
  const { data: files, error: listError } = await supabase.storage
    .from("proveedores")
    .list(folderPath);

  if (listError) {
    console.error("❌ Error al listar archivos:", listError);
    throw listError;
  }

  if (files && files.length > 0) {
    // Crear paths completos para eliminar todos los logos
    const filePaths = files.map(file => `${folderPath}/${file.name}`);
    
    const { error } = await supabase.storage
      .from("proveedores")
      .remove(filePaths);
      
    if (error) {
      console.error("❌ Error al eliminar logos:", error);
      throw error;
    }
    
    console.log("✅ Logos eliminados:", filePaths);
  }
};

// Eliminar logo específico por URL completa
export const eliminarLogoPorURL = async (logoUrl) => {
  if (!logoUrl) return;
  
  try {
    // Extraer el path del logo desde la URL
    const url = new URL(logoUrl);
    const pathParts = url.pathname.split('/');
    // El path está después de /storage/v1/object/public/proveedores/
    const bucketIndex = pathParts.findIndex(part => part === 'proveedores');
    if (bucketIndex === -1) {
      throw new Error('URL de logo inválida');
    }
    
    const logoPath = pathParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from("proveedores")
      .remove([logoPath]);
      
    if (error) {
      console.error("❌ Error al eliminar logo por URL:", error);
      throw error;
    }
    
    console.log("✅ Logo eliminado:", logoPath);
  } catch (error) {
    console.error("❌ Error al procesar URL de logo:", error);
    throw error;
  }
};
