import maplibregl from "maplibre-gl";
import { obtenerProveedores } from "./proveedorService";

/**
 * Inicializa el mapa de MapLibre con configuración base.
 */
export const crearMapaBase = (mapContainer, bounds) => {
  return new maplibregl.Map({
    container: mapContainer,
    style: "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
    center: [-58.95, -28.65],
    zoom: 2,
    maxBounds: bounds,
  });
};

/**
 * Evalúa visibilidad de un proveedor según filtros.
 */
export const getVisible = (prov, filtros) => {
  if (!filtros) return true;
  if (filtros.proveedor && prov.id != filtros.proveedor) return false;
  if (filtros.zona && prov.zona_id != filtros.zona) return false;
  if (filtros.tecnologia && prov.tecnologia !== filtros.tecnologia)
    return false;
  return true;
};

/**
 * Carga proveedores y los agrega al mapa con sus capas.
 */
export const cargarProveedoresEnMapa = async (map, filtros, setProveedorActivo) => {
  const proveedores = await obtenerProveedores();

  const proveedoresConEstado = proveedores.map((p) => ({
    ...p,
    visible: getVisible(p, filtros),
  }));

  proveedoresConEstado.forEach((prov) => {
    if (!prov.zonas || !prov.zonas.geom) return;

    const sourceId = `zona-${prov.id}`;
    const fillLayerId = `fill-${prov.id}`;
    const lineLayerId = `line-${prov.id}`;

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: prov.zonas.geom,
        properties: {},
      },
    });

    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": prov.color || "#888888",
        "fill-opacity": 0.4,
        "fill-opacity-transition": { duration: 300 },
      },
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": prov.color || "#000000",
        "line-width": 2,
        "line-opacity": 1,
        "line-opacity-transition": { duration: 300 },
      },
    });

    map.on("click", fillLayerId, () => {
      if (prov.visible) setProveedorActivo(prov);
    });

    map.on("mouseenter", fillLayerId, () => {
      if (!prov.visible) return;
      map.getCanvas().style.cursor = "pointer";
      map.setPaintProperty(fillLayerId, "fill-opacity", 0.6);
    });

    map.on("mouseleave", fillLayerId, () => {
      if (!prov.visible) return;
      map.getCanvas().style.cursor = "";
      map.setPaintProperty(fillLayerId, "fill-opacity", 0.4);
    });
  });

  return proveedoresConEstado;
};

/**
 * Actualiza la visibilidad visual de las capas en el mapa según filtros.
 */
export const actualizarVisibilidadEnMapa = (map, proveedoresRef, filtros) => {
  proveedoresRef.current.forEach((prov) => {
    const fillLayerId = `fill-${prov.id}`;
    const lineLayerId = `line-${prov.id}`;
    const visible = getVisible(prov, filtros);
    prov.visible = visible;

    if (map.getLayer(fillLayerId)) {
      map.setPaintProperty(fillLayerId, "fill-opacity", visible ? 0.4 : 0);
    }

    if (map.getLayer(lineLayerId)) {
      map.setPaintProperty(lineLayerId, "line-opacity", visible ? 1 : 0);
    }
  });
};
