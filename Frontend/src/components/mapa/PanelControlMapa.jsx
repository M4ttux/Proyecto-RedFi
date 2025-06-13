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
  const handleClickReseña = () => {
    if (!usuario) {
      setAlerta("Debes iniciar sesión para agregar una reseña");
      return;
    }
    onAbrirModalReseña();
  };

  return (
    <div className="absolute z-20 top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 w-4/5 max-w-xl lg:max-w-md bg-secundario/90 p-4 rounded-lg shadow-lg space-y-2">
      <BusquedaUbicacion
        boundsCorrientes={boundsCorrientes}
        setAlerta={setAlerta}
        mapRef={mapRef}
        cargandoUbicacion={cargandoUbicacion}
        onUbicacionActual={onUbicacionActual}
      />
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleClickReseña}
          disabled={!usuario}
          className={`w-full z-50 rounded font-semibold px-4 py-2 transition-colors ${
            usuario
              ? "bg-primario text-white hover:bg-acento"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          Agregar Reseña
        </button>
      </div>
      
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
