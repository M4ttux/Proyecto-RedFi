import { supabase } from "../supabase/client";

// Obtener todos los proveedores con tecnologías y zonas
export const obtenerProveedores = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(
      `
      *,
      ProveedorTecnologia (
        tecnologias (*)
      ),
      ZonaProveedor (
        zonas (*)
      )
    `
    )
    .order("nombre", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener proveedores");
    throw error;
  }
  return data;
};

// Obtener un proveedor por ID con sus reseñas y tecnologías
export const obtenerProveedorPorId = async (id, mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(
      `
      *,
      ProveedorTecnologia (
        tecnologias (*)
      ),
      reseñas (
        comentario,
        estrellas,
        created_at,
        user:user_profiles (
          nombre,
          foto_url
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    mostrarAlerta("Error al obtener proveedor");
    throw error;
  }
  return data;
};

export const obtenerProveedoresAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("proveedores")
    .select(
      "id, nombre, color, descripcion, sitio_web, ProveedorTecnologia(tecnologias(tecnologia))"
    );

  if (error) {
    mostrarAlerta("Error al obtener proveedores para admin.");
    throw error;
  }

  return data.map((p) => ({
    ...p,
    tecnologia: p.ProveedorTecnologia?.map(
      (t) => t.tecnologias?.tecnologia
    ).filter(Boolean),
  }));
};

export const obtenerTecnologiasDisponibles = async (
  mostrarAlerta = () => {}
) => {
  const { data, error } = await supabase
    .from("tecnologias")
    .select("id, tecnologia");
  if (error) {
    mostrarAlerta("Error al obtener tecnologías disponibles");
    throw error;
  }
  return data;
};

export const obtenerZonasDisponibles = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("zonas")
    .select("id, departamento");
  if (error) {
    mostrarAlerta("Error al obtener zonas disponibles");
    throw error;
  }
  return data;
};

// Crear proveedor
export const agregarProveedor = async (
  datos, // { nombre, descripcion, sitio_web, color, tecnologias: [], zonas: [] }
  mostrarAlerta = () => {}
) => {
  const { tecnologias, zonas, ...proveedorBase } = datos;

  const { data: proveedor, error: errorInsert } = await supabase
    .from("proveedores")
    .insert([proveedorBase])
    .select()
    .single();

  if (errorInsert) {
    mostrarAlerta("Error al agregar el proveedor.");
    throw errorInsert;
  }

  try {
    // Relacionar tecnologías
    if (Array.isArray(tecnologias) && tecnologias.length > 0) {
      const relacionesTecnologias = tecnologias.map((tecnologia_id) => ({
        proveedor_id: proveedor.id,
        tecnologia_id,
      }));

      const { error: errorTecnologias } = await supabase
        .from("ProveedorTecnologia")
        .insert(relacionesTecnologias);

      if (errorTecnologias) throw errorTecnologias;
    }

    // Relacionar zonas
    if (Array.isArray(zonas) && zonas.length > 0) {
      const relacionesZonas = zonas.map((zona_id) => ({
        proveedor_id: proveedor.id,
        zona_id,
      }));

      const { error: errorZonas } = await supabase
        .from("ZonaProveedor")
        .insert(relacionesZonas);

      if (errorZonas) throw errorZonas;
    }

    return proveedor;
  } catch (error) {
    mostrarAlerta("El proveedor fue creado, pero fallaron las relaciones.");
    throw error;
  }
};

// Editar proveedor
export const actualizarProveedor = async (
  proveedorId,
  datos, // { nombre, descripcion, sitio_web, color, tecnologias: [], zonas: [] }
  mostrarAlerta = () => {}
) => {
  const {
    tecnologias,
    zonas,
    ProveedorTecnologia,
    ZonaProveedor,
    tecnologia,
    ...proveedorBase
  } = datos;

  // 1. Actualizar datos del proveedor
  const { error: errorUpdate } = await supabase
    .from("proveedores")
    .update(proveedorBase)
    .eq("id", proveedorId);

  if (errorUpdate) {
    console.error(errorUpdate);
    mostrarAlerta("Error al actualizar el proveedor.");
    throw errorUpdate;
  }

  try {
    // 2. Eliminar relaciones anteriores
    await Promise.all([
      supabase
        .from("ProveedorTecnologia")
        .delete()
        .eq("proveedor_id", proveedorId),
      supabase.from("ZonaProveedor").delete().eq("proveedor_id", proveedorId),
    ]);

    // 3. Insertar nuevas relaciones
    if (Array.isArray(tecnologias) && tecnologias.length > 0) {
      const nuevasRelacionesTecnologia = (tecnologias || [])
        .filter((id) => id !== undefined && id !== null && id !== "")
        .map((tecnologia_id) => ({
          proveedor_id: proveedorId,
          tecnologia_id: parseInt(tecnologia_id),
        }));

      const { error: errorTecnologia } = await supabase
        .from("ProveedorTecnologia")
        .insert(nuevasRelacionesTecnologia);

      if (errorTecnologia) throw errorTecnologia;
    }

    if (Array.isArray(zonas) && zonas.length > 0) {
      const nuevasRelacionesZonas = (zonas || [])
        .filter((id) => id !== undefined && id !== null && id !== "")
        .map((zona_id) => ({
          proveedor_id: proveedorId,
          zona_id: parseInt(zona_id),
        }));

      const { error: errorZona } = await supabase
        .from("ZonaProveedor")
        .insert(nuevasRelacionesZonas);

      if (errorZona) throw errorZona;
    }

    return true;
  } catch (error) {
    mostrarAlerta(
      "El proveedor fue actualizado, pero fallaron las relaciones."
    );
    throw error;
  }
};

// Eliminar proveedor
export const eliminarProveedor = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("proveedores")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Error en eliminar Proveedor:", error);
    mostrarAlerta("Error al eliminar el proveedor.");
    throw error;
  }
};
