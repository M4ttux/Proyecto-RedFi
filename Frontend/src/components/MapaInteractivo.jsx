import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  /* estaEnCorrientes, */
  manejarUbicacionActual,
  buscarUbicacion,
  cargarReseñasEnMapa,
} from "../services/mapaService";
import { IconCurrentLocation } from "@tabler/icons-react";
import ModalProveedor from "./modals/ModalProveedor";
import ModalReseña from "./modals/ModalReseña";

const MapaInteractivo = ({ filtros }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [input, setInput] = useState("");
  const [alerta, setAlerta] = useState("");
  const proveedoresRef = useRef([]);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);
  const navigate = useNavigate();

  const [sugerencias, setSugerencias] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const boundsCorrientes = {
    west: -60.9,
    east: -54.1,
    south: -31.1,
    north: -26.1,
  };

  const [cargandoMapa, setCargandoMapa] = useState(true);

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
      await cargarReseñasEnMapa(map, setReseñaActiva); // modificala si hace falta
      setCargandoMapa(false);
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
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            if (debounceTimeout) clearTimeout(debounceTimeout);

            setDebounceTimeout(
              setTimeout(() => {
                if (value.trim().length > 2) {
                  fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                      value + ", Corrientes, Argentina"
                    )}&addressdetails=1&limit=5`
                  )
                    .then((res) => res.json())
                    .then((data) => setSugerencias(data))
                    .catch((err) =>
                      console.error("Error en autocompletar:", err)
                    );
                } else {
                  setSugerencias([]);
                }
              }, 150)
            );
          }}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            buscarUbicacion(input, boundsCorrientes, setAlerta, mapRef.current)
          }
          placeholder="Buscar en Corrientes..."
          className="px-3 py-2 rounded w-full bg-fondo text-sm text-texto placeholder-gray-400"
        />

        {input && sugerencias.length > 0 && (
          <ul className="bg-fondo border border-white/10 rounded-md mt-1 max-h-40 overflow-auto text-sm">
            {sugerencias.map((sug, index) => (
              <li
                key={index}
                onClick={() => {
                  setInput(sug.display_name);
                  setSugerencias([]);
                  const lat = parseFloat(sug.lat);
                  const lon = parseFloat(sug.lon);
                  mapRef.current.flyTo({ center: [lon, lat], zoom: 13 });
                }}
                className="px-3 py-2 cursor-pointer hover:bg-white/10"
              >
                {sug.display_name}
              </li>
            ))}
          </ul>
        )}

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

      {cargandoMapa && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-white text-lg font-semibold">
          Cargando mapa...
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />

      <ModalProveedor
        proveedor={proveedorActivo}
        onClose={() => setProveedorActivo(null)}
        navigate={navigate}
      />

      <ModalReseña
        reseña={reseñaActiva}
        onClose={() => setReseñaActiva(null)}
      />
    </div>
  );
};

export default MapaInteractivo;
