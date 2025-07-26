// src/services/relaciones/adminRelaciones.js
import { supabase } from "../../supabase/client";

export const obtenerProveedorTecnologia = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("ProveedorTecnologia")
    .select(`
      proveedor_id,
      proveedores (id, nombre),
      tecnologia_id,
      tecnologias (id, tecnologia)
    `);

  if (error) {
    mostrarAlerta("Error al obtener relaciones Proveedor-Tecnología");
    throw error;
  }

  return data;
};

export const obtenerZonaProveedor = async (mostrarAlerta = () => {}) => {
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
