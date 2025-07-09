import { IconX, IconCurrentLocation } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import { useBusquedaUbicacion } from "../../hooks/useBusquedaUbicacion";
import MainH3 from "../ui/MainH3";
import { manejarUbicacionActual } from "../../services/mapa";
import { useState, useEffect } from "react";
import { DURACION_ALERTA } from "../../constantes";
import Alerta from "../ui/Alerta";

const BusquedaUbicacion = ({ boundsCorrientes, setAlerta, alerta, mapRef }) => {
  const {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
    handleLimpiarBusqueda,
  } = useBusquedaUbicacion(boundsCorrientes, setAlerta, mapRef);

  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const handleUbicacionActual = async () => {
    setCargandoUbicacion(true);
    setAlerta(""); // limpiar mensajes anteriores
    try {
      await manejarUbicacionActual(boundsCorrientes, setAlerta, mapRef.current);
    } catch (error) {
      setAlerta("No se pudo obtener tu ubicación.");
    } finally {
      setTimeout(() => setCargandoUbicacion(false), 1000);
    }
  };

  // ✅ Auto-ocultar alerta después de DURACION_ALERTA ms
  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => {
        setAlerta("");
      }, DURACION_ALERTA);
      return () => clearTimeout(timer);
    }
  }, [alerta, setAlerta]);

  return (
    <div className="space-y-4 relative">
      {/* Input + sugerencias flotantes */}
      <div className="relative">
        <label htmlFor="busqueda" className="sr-only">
          Buscar ubicación
        </label>
        <input
          type="text"
          id="busqueda"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
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

      {/* Botones de acción */}
      <div className="flex items-center gap-4 pt-1">
        <MainButton
          onClick={handleBuscar}
          title="Buscar ubicación"
          type="button"
          variant="accent"
          className="flex-1"
        >
          Buscar ubicación
        </MainButton>
        <MainButton
          onClick={handleUbicacionActual}
          title="Ubicación actual"
          icon={IconCurrentLocation}
          type="button"
          variant="accent"
          className="hidden lg:inline-flex"
          loading={cargandoUbicacion}
        />
      </div>

      {/* Alerta si hay mensaje */}
      <Alerta mensaje={alerta} tipo="error" onCerrar={() => setAlerta("")} />
    </div>
  );
};

export default BusquedaUbicacion;
