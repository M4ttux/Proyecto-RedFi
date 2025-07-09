import { IconX, IconCurrentLocation, IconSearch } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import { useBusquedaUbicacion } from "../../hooks/useBusquedaUbicacion";
import { manejarUbicacionActual } from "../../services/mapa";
import { useState, useEffect, useRef } from "react";
import { DURACION_ALERTA } from "../../constants/constantes";
import Alerta from "../ui/Alerta";

const BusquedaUbicacion = ({ boundsCorrientes, setAlerta, alerta, mapRef }) => {
  const {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
    handleLimpiarBusqueda,
    setSugerencias,
  } = useBusquedaUbicacion(boundsCorrientes, setAlerta, mapRef);

  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const contenedorRef = useRef();

  const handleUbicacionActual = async () => {
    setCargandoUbicacion(true);
    setAlerta(""); // limpiar mensajes anteriores
    try {
      if (mapRef?.current) {
        await manejarUbicacionActual(
          boundsCorrientes,
          setAlerta,
          mapRef.current
        );
      } else {
        setAlerta("No se puede acceder al mapa en este momento.");
      }
    } catch (error) {
      setAlerta("No se pudo obtener tu ubicación.");
    } finally {
      setTimeout(() => setCargandoUbicacion(false), 1000);
    }
  };

  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => {
        setAlerta("");
      }, DURACION_ALERTA);
      return () => clearTimeout(timer);
    }
  }, [alerta, setAlerta]);

  useEffect(() => {
    const manejarClickAfuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setSugerencias([]); // cerramos las sugerencias si se hace click afuera
      }
    };

    document.addEventListener("mousedown", manejarClickAfuera);
    return () => document.removeEventListener("mousedown", manejarClickAfuera);
  }, []);

  const handleBuscarClick = () => {
    if (!input.trim()) {
      setAlerta("Por favor ingresá una ubicación.");
      return;
    }
    handleBuscar();
  };

  return (
    <div className="space-y-4 relative">
      {/* Input + botón en línea */}
      <div className="flex gap-2 relative" ref={contenedorRef}>
        <div className="relative flex-1">
          <label htmlFor="busqueda" className="sr-only">
            Buscar ubicación
          </label>
          <input
            type="text"
            id="busqueda"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBuscarClick();
              }
            }}
            placeholder="Buscar en Corrientes..."
            className="px-3 py-2 pr-10 rounded-lg w-full bg-fondo text-texto placeholder-gray-400 border border-white/20"
          />
          {input && (
            <MainButton
              onClick={handleLimpiarBusqueda}
              title="Limpiar búsqueda"
              type="button"
              variant="cross"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0"
            >
              <IconX size={24} />
            </MainButton>
          )}
          {/* Sugerencias flotantes */}
          {input && sugerencias.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 bg-fondo border border-white/10 rounded-lg mt-1 max-h-40 overflow-auto text-texto shadow-lg">
              {sugerencias.map((sug, index) => (
                <li
                  key={index}
                  onClick={() => handleSeleccionarSugerencia(sug)}
                  className="px-3 py-2 cursor-pointer hover:bg-white/10 transition"
                >
                  {sug.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>

        <MainButton
          onClick={handleBuscarClick}
          title="Buscar ubicación"
          type="button"
          variant="primary"
          className="self-start"
          icon={IconSearch}
        />
      </div>

      {/* Botón de ubicación actual */}
      <div className="pt-2 w-full">
        <MainButton
          onClick={handleUbicacionActual}
          title="Ubicación actual"
          icon={IconCurrentLocation}
          type="button"
          variant="accent"
          className="w-full lg:w-full"
          loading={cargandoUbicacion}
        >
          Ubicación actual
          </MainButton>
      </div>

      {/* Alerta si hay mensaje */}
      <Alerta mensaje={alerta} tipo="error" onCerrar={() => setAlerta("")} />
    </div>
  );
};

export default BusquedaUbicacion;
