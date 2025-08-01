import { estaEnCorrientes } from "./mapaBase";
import maplibregl from "maplibre-gl";

const API_KEY = "195f05dc4c614f52ac0ac882ee570395";

export const buscarUbicacion = async (input, bounds, mostrarAlerta = () => {}, map) => {
  if (!input.trim()) return;

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        input + ", Corrientes, Argentina"
      )}&key=${API_KEY}&limit=1&countrycode=ar`
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      mostrarAlerta("No se encontró la ubicación ingresada.");
      return;
    }

    const lugar = data.results[0];
    const lat = lugar.geometry.lat;
    const lon = lugar.geometry.lng;

    if (estaEnCorrientes(lon, lat, bounds)) {
      map.flyTo({ center: [lon, lat], zoom: 13 });
      colocarMarcadorUbicacion(map, [lon, lat]);
    } else {
      mostrarAlerta(
        `La ubicación encontrada (${lugar.formatted}) no está dentro de Corrientes.`
      );
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    mostrarAlerta("Ocurrió un error al buscar la ubicación.");
  }
};

export const manejarUbicacionActual = async (bounds, mostrarAlerta = () => {}, map) => {
  return new Promise((resolve) => {
    // Verificar si la geolocalización está disponible
    if (!navigator.geolocation) {
      mostrarAlerta("La geolocalización no está disponible en este dispositivo.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        console.log("📍 Ubicación obtenida:", { latitude, longitude });
        
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();
          const address = data.results[0].components;

          const ciudad =
            address.city ||
            address.town ||
            address.village ||
            "una ciudad desconocida";
          const provincia = address.state || "una provincia desconocida";

          console.log("🏙️ Ubicación detectada:", { ciudad, provincia });

          setTimeout(() => {
            if (provincia.toLowerCase() === "corrientes") {
              mostrarAlerta(`Estás en ${ciudad}, ${provincia}`);
              map.flyTo({ center: [longitude, latitude], zoom: 13 });
              colocarMarcadorUbicacion(map, [longitude, latitude]);
              resolve({ lat: latitude, lng: longitude });
            } else {
              mostrarAlerta(
                `Red-Fi solo está disponible en Corrientes. Estás en ${ciudad}, ${provincia}.`
              );
              resolve(null);
            }
          }, 50);

          resolve();
        } catch (error) {
          console.error("Error al obtener datos de ubicación:", error);
          mostrarAlerta("No se pudo obtener tu ubicación exacta.");
          resolve(null);
        }
      },
      (error) => {
        console.error("❌ Error de geolocalización:", error);
        
        let mensaje = "No se pudo obtener tu ubicación.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = "Permiso de ubicación denegado. Habilita la geolocalización en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = "Ubicación no disponible. Si estás en un emulador, configura una ubicación mock.";
            break;
          case error.TIMEOUT:
            mensaje = "Tiempo de espera agotado. Intenta nuevamente.";
            break;
          default:
            mensaje = `Error de ubicación: ${error.message || "Desconocido"}`;
        }
        
        mostrarAlerta(mensaje);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Aumentado de 10s a 15s
        maximumAge: 60000, // Acepta ubicaciones hasta 1 minuto de antigüedad
      }
    );
  });
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

export const eliminarMarcadorUbicacion = (map) => {
  if (map?.__marcadorUbicacion) {
    map.__marcadorUbicacion.remove();
    map.__marcadorUbicacion = null;
  }
};


export const obtenerCoordenadasSiEstanEnCorrientes = (bounds, mostrarAlerta = () => {}) => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      mostrarAlerta("La geolocalización no está disponible en este dispositivo.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        console.log("📍 Coordenadas obtenidas:", { latitude, longitude });

        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
          );
          const data = await response.json();
          const address = data.results[0].components;

          const provincia = address.state || "";

          if (provincia.toLowerCase() === "corrientes") {
            resolve({ lat: latitude, lng: longitude });
          } else {
            mostrarAlerta(
              `Estás fuera de Corrientes. Estás en ${provincia || "una provincia desconocida"}.`
            );
            resolve(null);
          }
        } catch (error) {
          console.error("Error al obtener datos de ubicación:", error);
          mostrarAlerta("No se pudo obtener tu ubicación exacta.");
          resolve(null);
        }
      },
      (error) => {
        console.error("❌ Error de geolocalización:", error);
        mostrarAlerta("No se pudo obtener tu ubicación.");
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  });
};
