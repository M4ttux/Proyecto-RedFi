import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerProveedores } from "../services/proveedorService";

const MapaInteractivo = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const bounds = [
    [-60.9, -31.1],
    [-54.1, -26.1],
  ];

  const [proveedorActivo, setProveedorActivo] = useState(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
      center: [-58.95, -28.65],
      zoom: 2,
      maxBounds: bounds,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      try {
        const proveedores = await obtenerProveedores();
        console.log("📦 Proveedores:", proveedores);

        proveedores.forEach((prov) => {
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
            },
          });

          map.addLayer({
            id: lineLayerId,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": prov.color || "#000000",
              "line-width": 2,
            },
          });

          // Evento click por zona
          map.on("click", fillLayerId, () => {
            setProveedorActivo(prov);
          });

          // Efecto hover: cambia la opacidad y escala el área
          map.on("mouseenter", fillLayerId, () => {
            map.getCanvas().style.cursor = "pointer";
            map.setPaintProperty(fillLayerId, "fill-opacity", 0.6);
            map.setPaintProperty(fillLayerId, "fill-outline-color", "#ffffff");
          });

          map.on("mouseleave", fillLayerId, () => {
            map.getCanvas().style.cursor = "";
            map.setPaintProperty(fillLayerId, "fill-opacity", 0.4);
            map.setPaintProperty(
              fillLayerId,
              "fill-outline-color",
              prov.color || "#000000"
            );
          });
        });
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    });

    return () => map.remove();
  }, []);

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