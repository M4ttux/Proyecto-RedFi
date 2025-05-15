import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProveedores } from "../services/proveedorService";

const MapaInteractivo = ({ filtros }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const proveedoresRef = useRef([]);
  const bounds = [
    [-60.9, -31.1],
    [-54.1, -26.1],
  ];

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
      center: [-58.95, -28.65],
      zoom: 2,
      maxBounds: bounds,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      try {
        const proveedores = await obtenerProveedores();
        proveedoresRef.current = proveedores.map((p) => ({
          ...p,
          visible: true, // default visible
        }));

        proveedoresRef.current.forEach((prov) => {
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

          // Eventos con verificación de visibilidad actual
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
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  // Actualizar visibilidad (opacidad) con transición
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    proveedoresRef.current.forEach((prov) => {
      const fillLayerId = `fill-${prov.id}`;
      const lineLayerId = `line-${prov.id}`;
      const visible = getVisible(prov);
      prov.visible = visible; // actualizar estado actual

      if (map.getLayer(fillLayerId)) {
        map.setPaintProperty(fillLayerId, "fill-opacity", visible ? 0.4 : 0);
      }

      if (map.getLayer(lineLayerId)) {
        map.setPaintProperty(lineLayerId, "line-opacity", visible ? 1 : 0);
      }
    });
  }, [filtros]);

  const getVisible = (prov) => {
    if (!filtros) return true;
    if (filtros.proveedor && prov.id != filtros.proveedor) return false;
    if (filtros.zona && prov.zona_id != filtros.zona) return false;
    if (filtros.tecnologia && prov.tecnologia !== filtros.tecnologia)
      return false;
    return true;
  };

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="w-full h-full" />

      {proveedorActivo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-secundario text-texto p-6 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setProveedorActivo(null)}
              className="absolute top-2 right-2 text-white text-lg"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-2">
              {proveedorActivo.nombre}
            </h2>
            <p>
              <strong>Tecnología:</strong> {proveedorActivo.tecnologia}
            </p>
            <p>
              <strong>Color:</strong> {proveedorActivo.color}
            </p>
            <button
              className="mt-4 bg-primario text-white px-4 py-2 rounded hover:bg-acento"
              onClick={() => {
                setProveedorActivo(null);
                navigate(`/proveedores/${proveedorActivo.id}`);
              }}
            >
              Más información
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaInteractivo;
