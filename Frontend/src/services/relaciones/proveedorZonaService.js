// src/services/relaciones/proveedorZonaService.js
import { supabase } from "../../supabase/client";

// Obtener todas las relaciones proveedor-zona
export const obtenerProveedorZona = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("ZonaProveedor")
    .select(`
      proveedor_id,
      proveedores (id, nombre),
      zona_id,
      zonas (id, departamento)
    `);

  if (error) {
    mostrarAlerta("Error al obtener relaciones Proveedor-Zona");
    throw error;
  }

  return data;
};

// Obtener zonas de un proveedor
export const obtenerZonasPorProveedor = async (proveedorId, mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("ZonaProveedor")
    .select("zona_id")
    .eq("proveedor_id", proveedorId);

  if (error) {
    mostrarAlerta("Error al obtener zonas asignadas.");
    throw error;
  }

  return data.map((z) => z.zona_id);
};

// Eliminar todas las relaciones proveedor-zona de un proveedor
export const eliminarProveedorZona = async (proveedorId, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("ZonaProveedor")
    .delete()
    .eq("proveedor_id", proveedorId);

  if (error) {
    mostrarAlerta("Error al eliminar zonas del proveedor.");
    throw error;
  }

  return data;
}