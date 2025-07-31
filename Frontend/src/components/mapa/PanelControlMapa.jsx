import { useAuth } from "../../context/AuthContext";
import BusquedaUbicacion from "./panel/BusquedaUbicacion";
import UbicacionActual from "./panel/UbicacionActual";
import FiltrosZona from "./filtros/FiltrosZona";
import BotonAgregarReseña from "./panel/BotonAgregarReseña";
import MainButton from "../ui/MainButton";
import MainH3 from "../ui/MainH3";
import { IconX, IconStar } from "@tabler/icons-react";

const PanelControlMapa = ({
  boundsCorrientes,
  mapRef,
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
      <BusquedaUbicacion boundsCorrientes={boundsCorrientes} mapRef={mapRef} />

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
      />
      {/* Leyenda de reseñas */}
      <div className="bg-texto/5 border border-texto/15 rounded-lg px-3 py-2 text-xs">
        <div className="flex justify-between text-center gap-2 px-4">
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#D7263D" }}
            ></div>
            <span className="text-texto/80 mt-0.5">1⭐</span>
            <span className="text-texto/80 mt-0.5">Muy malo</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#F46036" }}
            ></div>
            <span className="text-texto/80 mt-0.5">2⭐</span>
            <span className="text-texto/80 mt-0.5">Malo</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#FFD23F" }}
            ></div>
            <span className="text-texto/80 mt-0.5">3⭐</span>
            <span className="text-texto/80 mt-0.5">Regular</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#6CC551" }}
            ></div>
            <span className="text-texto/80 mt-0.5">4⭐</span>
            <span className="text-texto/80 mt-0.5">Bueno</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#36C9C6" }}
            ></div>
            <span className="text-texto/80 mt-0.5">5⭐</span>
            <span className="text-texto/80 mt-0.5">Excelente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelControlMapa;
