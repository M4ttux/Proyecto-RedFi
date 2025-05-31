import { obtenerProveedores } from "../proveedorService";
import { getVisible } from "./mapaBase";

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

    if (map.getSource(sourceId)) {
      map.removeLayer(fillLayerId);
      map.removeLayer(lineLayerId);
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: { type: "Feature", geometry: prov.zonas.geom, properties: {} },
    });

    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": prov.color || "#888888",
        "fill-opacity": 0.4, // 🔧 Opacidad fija, sin transiciones
      },
      // 🔧 Usar layout visibility en lugar de paint opacity
      layout: {
        "visibility": prov.visible ? "visible" : "none"
      }
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": prov.color || "#000000",
        "line-width": 2,
        "line-opacity": 1, // 🔧 Opacidad fija, sin transiciones
      },
      // 🔧 Usar layout visibility en lugar de paint opacity
      layout: {
        "visibility": prov.visible ? "visible" : "none"
      }
    });

    // 🔄 Solo agregar eventos de hover, NO de click (se maneja globalmente)
    map.on("mouseenter", fillLayerId, () => {
      if (!prov.visible) return;
      map.getCanvas().style.cursor = "pointer";
      map.setPaintProperty(fillLayerId, "fill-opacity", 0.6); // Solo hover effect
    });

    map.on("mouseleave", fillLayerId, () => {
      if (!prov.visible) return;
      map.getCanvas().style.cursor = "";
      map.setPaintProperty(fillLayerId, "fill-opacity", 0.4); // Solo hover effect
    });
  });

  return proveedoresConEstado;
};

export const actualizarVisibilidadEnMapa = (map, proveedoresRef, filtros) => {
  proveedoresRef.current.forEach((prov) => {
    const fillLayerId = `fill-${prov.id}`;
    const lineLayerId = `line-${prov.id}`;
    const visible = getVisible(prov, filtros);
    
    prov.visible = visible;

    // 🔧 Usar setLayoutProperty en lugar de setPaintProperty para eliminar transiciones
    if (map.getLayer(fillLayerId)) {
      map.setLayoutProperty(fillLayerId, "visibility", visible ? "visible" : "none");
    }
    if (map.getLayer(lineLayerId)) {
      map.setLayoutProperty(lineLayerId, "visibility", visible ? "visible" : "none");
    }
  });
};
