import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  estaEnCorrientes,
  manejarUbicacionActual,
  buscarUbicacion
} from "../services/mapaService";
import { IconCurrentLocation } from "@tabler/icons-react";

const MapaInteractivo = ({ filtros }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [input, setInput] = useState("");
  const [alerta, setAlerta] = useState("");
  const proveedoresRef = useRef([]);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const navigate = useNavigate();

  const boundsCorrientes = {
    west: -60.9,
    east: -54.1,
    south: -31.1,
    north: -26.1,
  };

  useEffect(() => {
    const map = crearMapaBase(mapContainer.current, [
      [boundsCorrientes.west, boundsCorrientes.south],
      [boundsCorrientes.east, boundsCorrientes.north],
    ]);
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      proveedoresRef.current = await cargarProveedoresEnMapa(
        map,
        filtros,
        setProveedorActivo
      );
    });

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtros);
    }
  }, [filtros]);

  return (
    <div className="h-full w-full relative">
      <div className="absolute z-20 top-4 left-4 bg-secundario/90 p-4 rounded-xl shadow-lg space-y-2 w-[500px]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            buscarUbicacion(input, boundsCorrientes, setAlerta, mapRef.current)
          }
          placeholder="Buscar en Corrientes..."
          className="px-3 py-2 rounded w-full bg-fondo text-sm text-texto placeholder-gray-400"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              buscarUbicacion(
                input,
                boundsCorrientes,
                setAlerta,
                mapRef.current
              )
            }
            className="flex-1 bg-primario text-white px-3 py-2 rounded hover:bg-acento transition text-sm"
          >
            Buscar ubicación
          </button>
          <button
            onClick={() =>
              manejarUbicacionActual(
                boundsCorrientes,
                setAlerta,
                mapRef.current
              )
            }
            className="p-2 bg-fondo text-texto rounded hover:bg-white/10 transition"
            title="Usar mi ubicación actual"
          >
            <IconCurrentLocation size={20} />
          </button>
        </div>

        {alerta && <p className="text-sm text-red-400">{alerta}</p>}
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      {proveedorActivo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-secundario p-6 rounded-lg max-w-md w-full relative shadow-lg">
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
