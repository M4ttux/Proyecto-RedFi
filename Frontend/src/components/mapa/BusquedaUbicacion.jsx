import { IconCurrentLocation } from "@tabler/icons-react";
import { useBusquedaUbicacion } from "../../hooks/useBusquedaUbicacion";

const BusquedaUbicacion = ({ 
  boundsCorrientes, 
  setAlerta, 
  mapRef, 
  cargandoUbicacion, 
  onUbicacionActual 
}) => {
  const {
    input,
    sugerencias,
    handleInputChange,
    handleBuscar,
    handleSeleccionarSugerencia,
  } = useBusquedaUbicacion(boundsCorrientes, setAlerta, mapRef);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-texto">Buscar ubicación</p>
      </div>
      
      <input
        type="text"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        placeholder="Buscar en Corrientes..."
        className="px-3 py-2 rounded w-full bg-fondo text-texto placeholder-gray-400"
      />
      
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
        <button
          onClick={handleBuscar}
          className="flex-1 bg-primario text-white font-semibold px-4 py-2 rounded hover:bg-acento transition"
        >
          Buscar ubicación
        </button>
        
        <button
          onClick={onUbicacionActual}
          className={`hidden lg:inline-flex items-center gap-1 px-4 py-2 rounded shadow-md transition ${
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
    </div>
  );
};

export default BusquedaUbicacion;
