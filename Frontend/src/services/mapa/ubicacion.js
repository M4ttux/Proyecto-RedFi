import { estaEnCorrientes } from "./mapaBase";
import maplibregl from "maplibre-gl";

const API_KEY = "195f05dc4c614f52ac0ac882ee570395";

export const buscarUbicacion = async (input, bounds, setAlerta, map) => {
  if (!input.trim()) return;

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(input)}&key=${API_KEY}&limit=1`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      setAlerta("No se encontró la ubicación ingresada.");
      return;
    }

    const lugar = data.results[0];
    const lat = lugar.geometry.lat;
    const lon = lugar.geometry.lng;

    if (estaEnCorrientes(lon, lat, bounds)) {
      setAlerta("");
      map.flyTo({ center: [lon, lat], zoom: 13 });
      colocarMarcadorUbicacion(map, [lon, lat]);
    } else {
      setAlerta(
        `La ubicación encontrada (${lugar.formatted}) no está dentro de Corrientes.`
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
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=195f05dc4c614f52ac0ac882ee570395`
          );
          const data = await response.json();
          const address = data.results[0].components;

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
              setAlerta(
                `Red-Fi solo está disponible en Corrientes. Estás en ${ciudad}, ${provincia}.`
              );
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
