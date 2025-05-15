/* import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { obtenerProveedores } from "../services/proveedorService";

const MapaInteractivo = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "/map-styles/americana.json", // Estilo base gratuito
      center: [-58.91, -37.98],
      zoom: 4,
    });

    // Agregar controles
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    return () => map.remove(); // Limpia al desmontar
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapaInteractivo;
 */


import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { obtenerProveedores } from "../services/proveedorService";

const MapaInteractivo = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "/map-styles/americana.json",
      center: [-58.91, -37.98],
      zoom: 4,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      console.log("🧭 Mapa cargado correctamente");

      try {
        const proveedores = await obtenerProveedores();
        console.log("📦 Proveedores cargados desde Supabase:", proveedores);

        proveedores.forEach((prov) => {
          if (!prov.zona || prov.zona.type !== "Polygon") {
            console.warn(`⚠️ Proveedor ${prov.id} tiene zona inválida:`, prov.zona);
            return;
          }

          const sourceId = `zona-${prov.id}`;
          const color = prov.color || "#00BFFF";

          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: prov.zona,
              properties: {},
            },
          });

          map.addLayer({
            id: `fill-${prov.id}`,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": color,
              "fill-opacity": 0.4,
            },
          });

          map.addLayer({
            id: `line-${prov.id}`,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": color,
              "line-width": 2,
            },
          });
        });
      } catch (error) {
        console.error("❌ Error al cargar proveedores:", error);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapaInteractivo;
