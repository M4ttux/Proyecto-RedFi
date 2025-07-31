import { obtenerProveedores } from "../proveedores/obtenerProveedor";
import { getVisible, getVisiblePorZona } from "./mapaBase";
import maplibregl from "maplibre-gl";

// Utilidad para calcular centroide de una zona
const calcularCentroide = (geom) => {
  const coords = geom.coordinates?.[0];
  if (!coords) return null;
  let x = 0,
    y = 0;
  coords.forEach(([lng, lat]) => {
    x += lng;
    y += lat;
  });
  return [x / coords.length, y / coords.length];
};

export const cargarProveedoresEnMapa = async (
  map,
  filtros,
  setProveedorActivo,
  onZonaMultiProveedorClick = null
) => {
  const proveedores = await obtenerProveedores();
  const proveedoresConEstado = proveedores.map((p) => ({
    ...p,
    visible: getVisible(p, filtros),
  }));

  const zonasConProveedores = new Map();

  for (const prov of proveedoresConEstado) {
    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) continue;

    for (const relacionZona of prov.ZonaProveedor) {
      const zona = relacionZona.zonas;
      if (!zona || !zona.geom) continue;

      // Agrupar por zona
      if (!zonasConProveedores.has(zona.id)) {
        zonasConProveedores.set(zona.id, {
          zona,
          proveedores: [],
        });
      }
      zonasConProveedores.get(zona.id).proveedores.push(prov);

      const sourceId = `zona-${prov.id}-${zona.id}`;
      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      if (map.getSource(sourceId)) {
        map.removeLayer(fillLayerId);
        map.removeLayer(lineLayerId);
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "Feature", geometry: zona.geom, properties: {} },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": prov.color || "#888888",
          "fill-opacity": 0.4,
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
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
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
        },
      });

      // Popup hover
      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
      });
      let popupTimeout = null;
      let lastMouseMove = null;

      map.on("mouseenter", fillLayerId, () => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "pointer";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.6);
      });

      map.on("mousemove", fillLayerId, (e) => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        lastMouseMove = Date.now();
        clearTimeout(popupTimeout);

        const zonaInfo = zonasConProveedores.get(zona.id);

        popupTimeout = setTimeout(() => {
          const quiet = Date.now() - lastMouseMove >= 350;
          if (quiet && !window.modoSeleccionActivo) {
            if (zonaInfo?.proveedores?.length > 1) {
              const contenido = zonaInfo.proveedores
                .map(
                  (p) =>
                    `<div><span style="color:${p.color}">⬤</span> ${p.nombre}</div>`
                )
                .join("");
              popup
                .setLngLat(e.lngLat)
                .setHTML(`<strong>Proveedores:</strong><br>${contenido}`)
                .addTo(map);
            } else {
              popup
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div class="text-sm font-semibold">${prov.nombre}</div>`
                )
                .addTo(map);
            }
          }
        }, 350);

        // Si ya está visible, seguirlo con el mouse
        if (popup.isOpen()) {
          popup.setLngLat(e.lngLat);
        }
      });

      map.on("mouseleave", fillLayerId, () => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.4);
        clearTimeout(popupTimeout);
        popup.remove();
      });

      // Solo manejar hover, el click lo manejaremos después globalmente
    }
  }

  // Handler global de click después de procesar todas las zonas
  const handleGlobalClick = (e) => {
    if (window.modoSeleccionActivo) return;
    
    // Buscar todas las features en el punto clickeado
    const features = map.queryRenderedFeatures(e.point);
    
    // Si hay reseñas, dejar que useMapaInteractivo las maneje
    const reseñaFeature = features.find(f => f.layer.id === "reseñas-layer");
    if (reseñaFeature) return;
    
    // Filtrar solo las features de proveedores visibles
    const proveedorFeatures = features.filter(feature => {
      const layerId = feature.layer.id;
      return layerId.startsWith('fill-') && feature.layer.layout?.visibility !== 'none';
    });
    
    if (proveedorFeatures.length === 0) return;
    
    // Obtener información de las zonas clickeadas
    const zonasClickeadas = new Set();
    const proveedoresEnClick = [];
    
    proveedorFeatures.forEach(feature => {
      const layerId = feature.layer.id;
      const match = layerId.match(/^fill-(\d+)-(\d+)$/);
      if (match) {
        const [, proveedorId, zonaId] = match;
        zonasClickeadas.add(parseInt(zonaId));
        
        // Buscar el proveedor correspondiente
        const proveedor = proveedoresConEstado.find(p => p.id === parseInt(proveedorId));
        if (proveedor && proveedor.visible) {
          proveedoresEnClick.push({ proveedor, zonaId: parseInt(zonaId) });
        }
      }
    });
    
    // Si hay múltiples proveedores en la misma zona, abrir modal múltiple
    for (const zonaId of zonasClickeadas) {
      const zonaInfo = zonasConProveedores.get(zonaId);
      
      if (zonaInfo?.proveedores?.length > 1 && onZonaMultiProveedorClick) {
        // Marcar globalmente que se manejó como zona múltiple
        window.zonaMultipleHandled = true;
        setTimeout(() => {
          window.zonaMultipleHandled = false;
        }, 100);
        
        onZonaMultiProveedorClick(zonaInfo.proveedores, zonaInfo.zona);
        return; // Salir temprano para evitar abrir modal individual
      }
    }
    
    // Si solo hay un proveedor, abrir modal individual
    if (proveedoresEnClick.length === 1) {
      setProveedorActivo(proveedoresEnClick[0].proveedor);
    }
  };
  
  // Remover event listener anterior si existe
  map.off('click', handleGlobalClick);
  // Agregar el nuevo event listener
  map.on('click', handleGlobalClick);

  return proveedoresConEstado;
};

export const actualizarVisibilidadEnMapa = (map, proveedoresRef, filtros) => {
  proveedoresRef.current.forEach((prov) => {
    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) return;

    prov.ZonaProveedor.forEach((relacionZona) => {
      const zona = relacionZona.zonas;
      if (!zona) return;

      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      const visible = getVisiblePorZona(prov, zona.id, filtros);

      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(
          fillLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(
          lineLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });
  });
};
