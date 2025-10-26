import { obtenerReseñas } from "../reseñas/reseñaCrud";

export const cargarReseñasEnMapa = async (
  map,
  setReseñaActiva,
  filtros = {},
  reseñasSourceId = "reseñas-source",
  reseñasLayerId = "reseñas-layer"
) => {
  try {
    const reseñas = await obtenerReseñas();

    const features = [];
    
    reseñas.forEach((r) => {
      const coords = r.ubicacion ? [r.ubicacion.lng, r.ubicacion.lat] : null;
      if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

      // Obtener todas las zonas del proveedor
      const zonasProveedor = r.proveedores?.ZonaProveedor?.map(zp => zp.zonas?.id).filter(Boolean) || [];
      
      // Crear una feature por cada zona donde opera el proveedor
      zonasProveedor.forEach((zonaId) => {
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: coords },
          properties: {
            // 🔧 Datos básicos
            id: r.id,
            proveedor_id: r.proveedor_id,
            usuario_id: r.usuario_id,
            estrellas: r.estrellas,
            comentario: r.comentario,
            zona_id: zonaId, // Zona específica para esta feature
            tecnologia: r.proveedores?.tecnologia || "",

            // 🔧 AGREGAR datos de relaciones completos
            user_profiles: r.user_profiles || null,
            proveedores: r.proveedores || null,

            // 🔧 También agregar nombres directamente para fácil acceso
            nombre_usuario:
              r.user_profiles?.nombre || `Usuario ${r.usuario_id}`,
            nombre_proveedor:
              r.proveedores?.nombre || `Proveedor ID: ${r.proveedor_id}`,
          },
        });
      });
      
      // Si no hay zonas, crear una feature sin zona específica
      if (zonasProveedor.length === 0) {
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: coords },
          properties: {
            id: r.id,
            proveedor_id: r.proveedor_id,
            usuario_id: r.usuario_id,
            estrellas: r.estrellas,
            comentario: r.comentario,
            zona_id: null,
            tecnologia: r.proveedores?.tecnologia || "",
            user_profiles: r.user_profiles || null,
            proveedores: r.proveedores || null,
            nombre_usuario:
              r.user_profiles?.nombre || `Usuario ${r.usuario_id}`,
            nombre_proveedor:
              r.proveedores?.nombre || `Proveedor ID: ${r.proveedor_id}`,
          },
        });
      }
    });

    const geojson = { type: "FeatureCollection", features };

    if (map.getSource(reseñasSourceId)) {
      map.getSource(reseñasSourceId).setData(geojson);
    } else {
      map.addSource(reseñasSourceId, { type: "geojson", data: geojson });
      map.addLayer({
        id: reseñasLayerId,
        type: "circle",
        source: reseñasSourceId,
        paint: {
          // Radio basado en las estrellas (4-8px)
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "estrellas"],
            1, 6,   // 1 estrella = 4px
            2, 6,   // 2 estrellas = 5px
            3, 6,   // 3 estrellas = 6px
            4, 6,   // 4 estrellas = 7px
            5, 6    // 5 estrellas = 8px
          ],
          // Color basado en las estrellas
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "estrellas"],
            1, "#D7263D",   // 1 estrella = rojo
            2, "#F46036",   // 2 estrellas = naranja
            3, "#FFD23F",   // 3 estrellas = amarillo
            4, "#6CC551",   // 4 estrellas = verde claro
            5, "#36C9C6"    // 5 estrellas = verde
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
          // Opacidad para mayor contraste
          "circle-opacity": 0.8
        },
      });

      // 🔄 Solo eventos de hover, NO de click (se maneja globalmente)
      map.on("mouseenter", reseñasLayerId, () => {
        if (window.modoSeleccionActivo) return;
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", reseñasLayerId, () => {
        if (window.modoSeleccionActivo) return;
        map.getCanvas().style.cursor = "";
      });
    }

    actualizarVisibilidadReseñas(map, filtros, reseñasLayerId);

  } catch (error) {
    console.error("Error en cargarReseñasEnMapa:", error);
    throw error;
  }
};

export const actualizarVisibilidadReseñas = (
  map,
  filtros,
  layerId = "reseñas-layer"
) => {
  if (!map.getLayer(layerId)) return;

  const filter = ["all"];
  
  // Filtro por proveedor
  if (filtros.proveedor && filtros.proveedor.id)
    filter.push(["==", ["get", "proveedor_id"], Number(filtros.proveedor.id)]);
    
  // Filtro por zona - ahora usando zona_id directo
  if (filtros.zona && filtros.zona.id) {
    filter.push(["==", ["get", "zona_id"], Number(filtros.zona.id)]);
  }
  
  // Filtro por tecnología
  if (filtros.tecnologia)
    filter.push(["==", ["get", "tecnologia"], filtros.tecnologia]);
    
  // Filtro por valoración
  if (filtros.valoracionMin && !isNaN(filtros.valoracionMin))
    filter.push(["==", ["get", "estrellas"], filtros.valoracionMin]);

  map.setFilter(layerId, filter);
};
