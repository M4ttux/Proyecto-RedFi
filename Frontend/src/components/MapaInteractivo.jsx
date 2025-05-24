import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  manejarUbicacionActual,
  buscarUbicacion,
  cargarReseñasEnMapa,
} from "../services/mapaService";
import ModalProveedor from "./modals/ModalProveedor";
import ModalReseña from "./modals/ModalReseña";
import { DURACION_ALERTA } from "../constantes";
import { IconCurrentLocation } from "@tabler/icons-react";

const MapaInteractivo = ({ filtros }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navControlRef = useRef(null);
  const [input, setInput] = useState("");
  const [alerta, setAlerta] = useState("");
  const proveedoresRef = useRef([]);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [animarAlerta, setAnimarAlerta] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

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

    const navControl = new maplibregl.NavigationControl();
    navControlRef.current = navControl;

    const setNavPosition = () => {
      const isMobile = window.innerWidth < 1024;
      try {
        map.removeControl(navControl);
      } catch (e) {}
      map.addControl(navControl, isMobile ? "bottom-left" : "bottom-right");
    };

    setNavPosition();
    window.addEventListener("resize", setNavPosition);

    map.on("load", async () => {
      proveedoresRef.current = await cargarProveedoresEnMapa(
        map,
        filtros,
        setProveedorActivo
      );
      setCargandoMapa(false);
    });

    return () => {
      map.remove();
      window.removeEventListener("resize", setNavPosition);
    };
  }, []);

  useEffect(() => {
    const manejarEvento = () => {
      if (mapRef.current) {
        manejarUbicacionActual(boundsCorrientes, setAlerta, mapRef.current);
      }
    };

    window.addEventListener("solicitarUbicacion", manejarEvento);
    return () => {
      window.removeEventListener("solicitarUbicacion", manejarEvento);
    };
  }, []);

  useEffect(() => {
    if (!cargandoMapa && mapRef.current) {
      actualizarVisibilidadEnMapa(mapRef.current, proveedoresRef, filtros);
      cargarReseñasEnMapa(mapRef.current, setReseñaActiva, filtros);
    }
  }, [cargandoMapa, proveedoresRef, filtros]);

  useEffect(() => {
    if (alerta) {
      setMostrarAlerta(true); // Renderiza el <p>
      const fadeIn = setTimeout(() => setAnimarAlerta(true), 10); // Activa fade-in
      const fadeOut = setTimeout(() => setAnimarAlerta(false), DURACION_ALERTA); // Activa fade-out
      const remove = setTimeout(
        () => setMostrarAlerta(false),
        DURACION_ALERTA + 500
      ); // Lo remueve del DOM

      return () => {
        clearTimeout(fadeIn);
        clearTimeout(fadeOut);
        clearTimeout(remove);
      };
    }
  }, [alerta]);

  return (
    <div className="h-full w-full relative">
      {/* Barra de búsqueda visible siempre */}
      <div className="absolute z-20 top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 w-4/5 max-w-xl lg:max-w-md bg-secundario/90 p-4 rounded-xl shadow-lg space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-texto">Buscar ubicación</p>
        </div>

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
                  buscarUbicacion(
                    sug.display_name,
                    boundsCorrientes,
                    setAlerta,
                    mapRef.current
                  );
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
          {/* Botón solo visible en desktop */}
          <button
            onClick={() => {
              setCargandoUbicacion(true);
              const evento = new CustomEvent("solicitarUbicacion");
              window.dispatchEvent(evento);

              // Reestablece después de un delay de seguridad
              setTimeout(
                () => setCargandoUbicacion(false),
                DURACION_ALERTA + 1000
              );
            }}
            className={`hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm shadow-md transition
    ${
      cargandoUbicacion
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-primario hover:bg-acento"
    }`}
            disabled={cargandoUbicacion}
            title="Ubicación actual"
          >
            <IconCurrentLocation size={24} className="text-white" />
          </button>
        </div>

        {mostrarAlerta && (
          <p
            className={`text-sm text-red-400 transition-opacity duration-500 ${
              animarAlerta ? "opacity-100" : "opacity-0"
            }`}
          >
            {alerta}
          </p>
        )}
      </div>

      {/* Cargando mapa */}
      {cargandoMapa && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-white text-lg font-semibold">
          Cargando mapa...
        </div>
      )}

      {/* Contenedor del mapa */}
      <div
        ref={mapContainer}
        className={`w-full h-full transition-opacity duration-700 ease-in-out ${
          cargandoMapa ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Modales */}
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
