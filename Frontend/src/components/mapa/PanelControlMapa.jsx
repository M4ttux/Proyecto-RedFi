import { useAuth } from "../../context/AuthContext";
import BusquedaUbicacion from "./BusquedaUbicacion";
import UbicacionActual from "./UbicacionActual";
import FiltrosZona from "./filtros/FiltrosZona";
import BotonAgregarReseña from "./BotonAgregarReseña";
import MainButton from "../ui/MainButton";
import MainH3 from "../ui/MainH3";
import { IconX } from "@tabler/icons-react";

const PanelControlMapa = ({
  boundsCorrientes,
  alerta,
  setAlerta,
  mapRef,
  cargandoUbicacion,
  onUbicacionActual,
  onAbrirModalReseña,
  filtros,
  setFiltros,
  zonas,
  proveedores,
  tecnologiasUnicas,
  cargandoZonas,
  cargandoProveedores,
  cargandoTecnologias,
  onFiltrar,
  onCerrarPanel,
}) => {
  const { usuario } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <MainH3 className="mb-0">Panel de control</MainH3>
        {onCerrarPanel && (
          <MainButton
            onClick={onCerrarPanel}
            variant="cross"
            className="lg:hidden px-0"
            title="Cerrar panel"
          >
            <IconX size={24} />
          </MainButton>
        )}
      </div>

      {/* Busqueda */}
      <BusquedaUbicacion
        boundsCorrientes={boundsCorrientes}
        mapRef={mapRef}
        alerta={alerta}
        setAlerta={setAlerta}
      />

      {/* Botón de ubicación */}
      <UbicacionActual mapRef={mapRef} boundsCorrientes={boundsCorrientes} />

      {/* Filtros */}
      <FiltrosZona
        filtros={filtros}
        setFiltros={setFiltros}
        onFiltrar={onFiltrar}
        zonas={zonas}
        proveedores={proveedores}
        tecnologiasUnicas={tecnologiasUnicas}
        cargandoZonas={cargandoZonas}
        cargandoProveedores={cargandoProveedores}
        cargandoTecnologias={cargandoTecnologias}
      />

      {/* Botón de reseña */}
      <BotonAgregarReseña
        usuario={usuario}
        onAbrirModalReseña={onAbrirModalReseña}
        setAlerta={setAlerta}
      />
    </div>
  );
};

export default PanelControlMapa;
