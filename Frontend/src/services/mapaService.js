import maplibregl from "maplibre-gl";
import { obtenerProveedores } from "./proveedorService";
import { obtenerReseñas } from "./reseñaService";

export const estaEnCorrientes = (lng, lat, bounds) => {
  return (
    lng >= bounds.west &&
    lng <= bounds.east &&
    lat >= bounds.south &&
    lat <= bounds.north
  );
};

export const crearMapaBase = (mapContainer, bounds) => {
  return new maplibregl.Map({
    container: mapContainer,
    style:
      "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
    center: [-58.95, -28.65],
    zoom: 2,
    maxBounds: bounds,
    attributionControl: false,
  });
};

export const getVisible = (prov, filtros) => {
  if (!filtros) return true;
  if (filtros.proveedor && prov.id != filtros.proveedor) return false;
  if (filtros.zona && prov.zona_id != filtros.zona) return false;
  if (filtros.tecnologia && prov.tecnologia !== filtros.tecnologia) return false;
  return true;
};

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
        "fill-opacity": prov.visible ? 0.4 : 0,
      },
    });

    map.addLayer({
      id: lineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": prov.color || "#000000",
        "line-width": 2,
        "line-opacity": prov.visible ? 1 : 0,
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

export const cargarReseñasEnMapa = async (map, setReseñaActiva, filtros = {}, marcadoresRef) => {
  if (!filtros) filtros = {};

  const reseñas = await obtenerReseñas();

  const reseñasConEstado = reseñas.map((r) => {
    const visible =
      (!filtros.proveedor || r.proveedor_id === filtros.proveedor) &&
      (!filtros.valoracionMin || r.estrellas >= parseInt(filtros.valoracionMin)) &&
      (!filtros.zona || r.proveedores?.zona_id === filtros.zona) &&
      (!filtros.tecnologia || r.proveedores?.tecnologia === filtros.tecnologia);

    return { ...r, visible };
  });

  reseñasConEstado.forEach((r) => {
    let marcadorExistente = marcadoresRef.current.find((m) => m.reseña.id === r.id);

    if (marcadorExistente) {
      // Actualiza la visibilidad
      marcadorExistente.element.style.opacity = r.visible ? "1" : "0";
    } else if (r.visible) {
      const coords = r.proveedores?.zonas?.geom?.coordinates?.flat(2);
      if (!Array.isArray(coords) || coords.length < 2) return;

      const [lng, lat] = coords;

      const markerEl = document.createElement("div");
      markerEl.className =
        "w-4 h-4 bg-[#FB8531] rounded-full border border-white shadow-md opacity-0 hover:shadow-xl hover:ring-2 hover:ring-white/40 cursor-pointer transition-all duration-300";

      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        setReseñaActiva(r);
      });

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      setTimeout(() => {
        markerEl.classList.remove("opacity-0");
        markerEl.classList.add("opacity-100");
      }, 10);

      marcadoresRef.current.push({ marker, element: markerEl, reseña: r });
    }
  });
};

export const limpiarMarcadoresReseñas = (marcadoresRef) => {
  marcadoresRef.current.forEach(({ marker }) => marker.remove());
  marcadoresRef.current = [];
};

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

export const buscarUbicacion = async (input, bounds, setAlerta, map) => {
  if (!input.trim()) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        input
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
      colocarMarcadorUbicacion(map, [lon, lat]);
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

export const colocarMarcadorUbicacion = (map, coords) => {
  try {
    const markerEl = document.createElement("div");
    markerEl.style.width = "16px";
    markerEl.style.height = "16px";
    markerEl.style.backgroundColor = "#0047D6";
    markerEl.style.borderRadius = "50%";
    markerEl.style.border = "2px solid white";
    markerEl.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
    markerEl.style.pointerEvents = "none";

    if (map.__marcadorUbicacion) {
      map.__marcadorUbicacion.remove();
    }

    const marker = new maplibregl.Marker({
      element: markerEl,
      anchor: "center",
    })
      .setLngLat(coords)
      .addTo(map);

    map.__marcadorUbicacion = marker;
  } catch (error) {
    console.error("❌ Error colocando marcador:", error);
  }
};

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

          setAlerta(""); // Reinicia alerta para trigger del hook
          setTimeout(() => {
            if (provincia.toLowerCase() === "corrientes") {
              setAlerta(`Estás en ${ciudad}, ${provincia}`);
              map.flyTo({ center: [longitude, latitude], zoom: 13 });
              colocarMarcadorUbicacion(map, [longitude, latitude]);
            } else {
              setAlerta(`Red-Fi solo está disponible en Corrientes. Estás en ${ciudad}, ${provincia}.`);
            }
          }, 50);

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
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};
