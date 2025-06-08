import { useAuth } from "../../context/AuthContext";
import { useAlertaAnimada } from "../../hooks/useAlertaAnimada";
import BusquedaUbicacion from "./BusquedaUbicacion";

const PanelControlMapa = ({ 
  boundsCorrientes, 
  alerta, 
  setAlerta, 
  mapRef, 
  cargandoUbicacion, 
  onUbicacionActual, 
  onAbrirModalReseña 
}) => {
  const { usuario } = useAuth();
  const { mostrarAlerta, animarAlerta } = useAlertaAnimada(alerta);

  return (
    <div className="absolute z-20 top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 w-4/5 max-w-xl lg:max-w-md bg-secundario/90 p-4 rounded-lg shadow-lg space-y-2">
      <BusquedaUbicacion
        boundsCorrientes={boundsCorrientes}
        setAlerta={setAlerta}
        mapRef={mapRef}
        cargandoUbicacion={cargandoUbicacion}
        onUbicacionActual={onUbicacionActual}
      />
      
      {usuario && (
        <div className="flex items-center gap-2">
          <button
            onClick={onAbrirModalReseña}
            className="w-full z-50 bg-primario rounded font-semibold text-white px-4 py-2 hover:bg-acento"
          >
            Agregar Reseña
          </button>
        </div>
      )}
      
      {mostrarAlerta && (
        <p
          className={`text-red-400 transition-opacity duration-500 ${
            animarAlerta ? "opacity-100" : "opacity-0"
          }`}
        >
          {alerta}
        </p>
      )}
    </div>
  );
};

export default PanelControlMapa;
