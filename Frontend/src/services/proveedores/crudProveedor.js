import { supabase } from "../../supabase/client";
import { eliminarLogoProveedor } from "./logoProveedor";

export const crearProveedor = async (
  datos, // { nombre, descripcion, sitio_web, color, logotipo }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, ...proveedorBase } = datos;

  const { data: proveedor, error } = await supabase
    .from("proveedores")
    .insert([proveedorBase])
    .select()
    .single();

  if (error) {
    mostrarAlerta("Error al agregar el proveedor.");
    throw error;
  }

  return proveedor;
};


// Editar proveedor sin modificar relaciones
export const actualizarProveedor = async (
  proveedorId,
  datos, // { nombre, descripcion, sitio_web, color, logotipo }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, eliminarLogo, ...proveedorBase } = datos;

  const { error: errorUpdate } = await supabase
    .from("proveedores")
    .update(proveedorBase)
    .eq("id", proveedorId);

  if (errorUpdate) {
    console.error(errorUpdate);
    mostrarAlerta("Error al actualizar el proveedor.");
    throw errorUpdate;
  }

  return true;
};

// Eliminar proveedor
export const eliminarProveedor = async (id, mostrarAlerta = () => {}) => {
  try {
    // 1. Eliminar todos los logos del bucket usando el ID
    await eliminarLogoProveedor(id);

    // 2. Eliminar el proveedor de la base de datos
    const { error } = await supabase.from("proveedores").delete().eq("id", id);

    if (error) {
      console.error("❌ Error al eliminar Proveedor:", error);
      mostrarAlerta("Error al eliminar el proveedor.");
      throw error;
    }

    console.log("✅ Proveedor eliminado correctamente:", id);

  } catch (err) {
    console.error("❌ Error general en eliminación:", err);
    throw err;
  }
};