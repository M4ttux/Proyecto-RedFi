import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { obtenerProveedores } from "../services/proveedorService";

const MapaInteractivo = () => {
  const mapContainer = useRef(null);
  const bounds = [ // limitar a Corrientes
    [-60.9, -31.1],
    [-54.1, -26.1]
  ];

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "/map-styles/americana.json",
      center: [-58.95, -28.65], 
      zoom: 2,
      maxBounds: bounds
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      try {
        const proveedores = await obtenerProveedores();
        console.log("📦 Proveedores:", proveedores);
        

        proveedores.forEach((prov) => {
          if (!prov.zonas || !prov.zonas.geom) return;

          map.addSource(`zona-${prov.id}`, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: prov.zonas.geom,
              properties: {},
            },
          });

          map.addLayer({
            id: `fill-${prov.id}`,
            type: "fill",
            source: `zona-${prov.id}`,
            paint: {
              "fill-color": prov.color || "#888888",
              "fill-opacity": 0.4,
            },
          });

          map.addLayer({
            id: `line-${prov.id}`,
            type: "line",
            source: `zona-${prov.id}`,
            paint: {
              "line-color": prov.color || "#000000",
              "line-width": 2,
            },
          });
        });
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapaInteractivo;
