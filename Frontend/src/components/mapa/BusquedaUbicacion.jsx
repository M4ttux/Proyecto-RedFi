import { useState, useEffect, useRef } from "react";
import { IconX, IconCurrentLocation, IconSearch } from "@tabler/icons-react";
import { useBusquedaUbicacion } from "../../hooks/useBusquedaUbicacion";
import { manejarUbicacionActual } from "../../services/mapa";
import { DURACION_ALERTA } from "../../constants/constantes";
import MainButton from "../ui/MainButton";
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


  const [inputInvalido, setInputInvalido] = useState(false);

  const contenedorRef = useRef();


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
      setInputInvalido(true);
      return;
    }
    setInputInvalido(false); // limpiar error si luego hace una búsqueda válida
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
            onChange={(e) => {
              handleInputChange(e.target.value);
              if (inputInvalido) setInputInvalido(false); // limpiar borde rojo al escribir
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBuscarClick();
              }
            }}
            placeholder="Buscar en Corrientes..."
            className={`px-3 py-2 pr-10 rounded-lg w-full bg-fondo text-texto placeholder-gray-400 border transition-all duration-300 ${
              inputInvalido ? "border-red-500/30" : "border-white/20"
            }`}
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

          {/* Alerta si hay mensaje */}
          {alerta && (
            <div className="absolute top-full left-0 w-full mt-2 z-50">
              <Alerta
                mensaje={alerta}
                tipo="error"
                onCerrar={() => setAlerta("")}
                flotante // activa estilos flotantes
              />
            </div>
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
    </div>
  );
};

export default BusquedaUbicacion;
