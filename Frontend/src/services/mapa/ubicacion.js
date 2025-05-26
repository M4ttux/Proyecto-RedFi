import { estaEnCorrientes } from "./mapaBase";
import maplibregl from "maplibre-gl";

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

          setAlerta(""); 
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
