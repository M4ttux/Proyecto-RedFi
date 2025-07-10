import { useAuth } from "../../context/AuthContext";
import BusquedaUbicacion from "./BusquedaUbicacion";
import UbicacionActual from "./UbicacionActual";
import MainButton from "../ui/MainButton";
import MainH3 from "../ui/MainH3";
import { BOUNDS_CORRIENTES } from "../../constants/constantes";

const PanelControlMapa = ({
  boundsCorrientes,
  alerta,
  setAlerta,
  mapRef,
  cargandoUbicacion,
  onUbicacionActual,
  onAbrirModalReseña,
}) => {
  const { usuario } = useAuth();
  const handleClickReseña = () => {
    if (!usuario) {
      setAlerta("Debes iniciar sesión para agregar una reseña");
      return;
    }
    onAbrirModalReseña();
  };

  return (
    /* <div className="absolute z-20 top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 w-4/5 max-w-xl lg:max-w-md bg-secundario/90 p-4 rounded-lg shadow-lg space-y-2"> */
    <div>
      <div className="space-y-4">
        <BusquedaUbicacion
          boundsCorrientes={boundsCorrientes}
          mapRef={mapRef}
          setAlerta={setAlerta}
          alerta={alerta}
          cargandoUbicacion={cargandoUbicacion}
          onUbicacionActual={onUbicacionActual}
        />

        <div className="flex flex-col items-center gap-2">
          <MainButton
            onClick={handleClickReseña}
            disabled={!usuario}
            variant={usuario ? "accent" : "disabled"}
            className="w-full"
          >
            Agregar reseña
          </MainButton>
          {!usuario && (
            <p className="text-sm text-white/60 italic animate-fade-in">
              Necesitas iniciar sesión para acceder a esta función.
            </p>
          )}
        </div>
        <div>
          <UbicacionActual
            mapRef={mapRef}
            boundsCorrientes={BOUNDS_CORRIENTES}
          />
        </div>
      </div>
    </div>
  );
};

export default PanelControlMapa;
