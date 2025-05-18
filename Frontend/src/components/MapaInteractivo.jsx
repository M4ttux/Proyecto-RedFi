import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
} from "../services/mapaService";

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
    const map = crearMapaBase(mapContainer.current, bounds);
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      proveedoresRef.current = await cargarProveedoresEnMapa(
        map,
        filtros,
        setProveedorActivo
      );
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtros);
    }
  }, [filtros]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="w-full h-full" />

      {proveedorActivo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-secundario p-6 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setProveedorActivo(null)}
              className="absolute top-2 right-2 text-lg hover:text-amber-700 transition"
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
              className="mt-4 bg-primario px-4 py-2 rounded hover:bg-acento transition"
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
