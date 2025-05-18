import maplibregl from "maplibre-gl";
import { obtenerProveedores } from "./proveedorService";
import { obtenerReseñas } from "./reseñaService";

/**
 * Inicializa el mapa de MapLibre con configuración base.
 */
export const crearMapaBase = (mapContainer, bounds) => {
  return new maplibregl.Map({
    container: mapContainer,
    style:
      "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
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
export const cargarProveedoresEnMapa = async (
  map,
  filtros,
  setProveedorActivo
) => {
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

export const cargarReseñasEnMapa = async (map, setReseñaActiva) => {
  const reseñas = await obtenerReseñas();

  reseñas.forEach((r) => {
    const coord = r.proveedores?.zonas?.geom?.coordinates?.[0]?.[0];
    if (!coord) return;

    const [lng, lat] = coord;

    const markerEl = document.createElement("div");
    markerEl.className =
      "w-4 h-4 bg-[#FB8531] rounded-full border border-white shadow-md hover:shadow-xl hover:ring-2 hover:ring-white/40 transition-all duration-300 ease-out cursor-pointer";

    markerEl.addEventListener("click", (e) => {
      e.stopPropagation();
      setReseñaActiva(r);
    });

    new maplibregl.Marker({ element: markerEl, anchor: "center" })
      .setLngLat([lng, lat])
      .addTo(map);
  });
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

/**
 * Ajusta el mapa a los límites de las zonas de los proveedores.
 */
export const estaEnCorrientes = (lng, lat, bounds) => {
  return (
    lng >= bounds.west &&
    lng <= bounds.east &&
    lat >= bounds.south &&
    lat <= bounds.north
  );
};

/**
 * Maneja la ubicación actual del usuario y ajusta el mapa.
 */
export const manejarUbicacionActual = async (bounds, setAlerta, map) => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const address = data.address;
          const ciudad =
            address.city ||
            address.town ||
            address.village ||
            "una ciudad desconocida";
          const provincia = address.state || "una provincia desconocida";

          if (provincia.toLowerCase() === "corrientes") {
            setAlerta("");
            map.flyTo({ center: [longitude, latitude], zoom: 13 });
          } else {
            setAlerta(
              `Red-Fi solo está disponible en Corrientes. Estás en ${ciudad}, ${provincia}.`
            );
          }
          resolve();
        } catch (error) {
          console.error("Error al obtener datos de ubicación:", error);
          setAlerta("No se pudo obtener tu ubicación exacta.");
          resolve();
        }
      },
      () => {
        setAlerta("No se pudo obtener tu ubicación.");
        resolve();
      }
    );
  });
};

/**
 * Busca una ubicación ingresada por el usuario y ajusta el mapa.
 */
export const buscarUbicacion = async (input, bounds, setAlerta, map) => {
  if (!input.trim()) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        input + ", Corrientes, Argentina"
      )}&limit=1`
    );
    const resultados = await response.json();

    if (resultados.length === 0) {
      setAlerta("No se encontró la ubicación ingresada.");
      return;
    }

    const lugar = resultados[0];
    const lat = parseFloat(lugar.lat);
    const lon = parseFloat(lugar.lon);

    if (estaEnCorrientes(lon, lat, bounds)) {
      setAlerta("");
      map.flyTo({ center: [lon, lat], zoom: 13 });
    } else {
      setAlerta(
        `La ubicación encontrada (${lugar.display_name}) no está dentro de Corrientes.`
      );
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    setAlerta("Ocurrió un error al buscar la ubicación.");
  }
};
