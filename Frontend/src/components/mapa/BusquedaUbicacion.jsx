import { IconX, IconCurrentLocation } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import { useBusquedaUbicacion } from "../../hooks/useBusquedaUbicacion";

const BusquedaUbicacion = ({
  boundsCorrientes,
  setAlerta,
  mapRef,
  cargandoUbicacion,
  onUbicacionActual,
}) => {
  const {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
    handleLimpiarBusqueda,
  } = useBusquedaUbicacion(boundsCorrientes, setAlerta, mapRef);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-texto">Buscar ubicación</p>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          placeholder="Buscar en Corrientes..."
          className="px-3 py-2 pr-10 rounded w-full bg-fondo text-texto placeholder-gray-400"
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
      </div>

      {input && sugerencias.length > 0 && (
        <ul className="bg-fondo border border-white/10 rounded-lg mt-1 max-h-40 overflow-auto text-texto">
          {sugerencias.map((sug, index) => (
            <li
              key={index}
              onClick={() => handleSeleccionarSugerencia(sug)}
              className="px-3 py-2 cursor-pointer hover:bg-white/10"
            >
              {sug.formatted}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <MainButton
          onClick={handleBuscar}
          title="Buscar ubicación"
          type="button"
          variant="primary"
          className="flex-1"
        >
          Buscar ubicación
        </MainButton>
        <MainButton
          onClick={onUbicacionActual}
          title="Ubicación actual"
          icon={IconCurrentLocation}
          type="button"
          variant="primary"
          className="hidden lg:inline-flex"
          loading={cargandoUbicacion}
        >
        </MainButton>
      </div>
    </div>
  );
};

export default BusquedaUbicacion;
