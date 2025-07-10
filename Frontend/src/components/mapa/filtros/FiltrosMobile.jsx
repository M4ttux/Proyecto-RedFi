import PanelControlMapa from "../PanelControlMapa";
import { useState } from "react";

const FiltrosMobile = ({
  filtrosTemporales,
  setFiltrosTemporales,
  setFiltrosAplicados,
  setMostrarFiltros,
  zonas,
  proveedores,
  tecnologiasUnicas,
  cargandoZonas,
  cargandoProveedores,
  cargandoTecnologias,
  boundsCorrientes,
  mapRef,
}) => {
  const [alertaMobile, setAlertaMobile] = useState("");
  const handleAplicarFiltros = (filtrosFinales) => {
    setFiltrosAplicados(filtrosFinales);
    setMostrarFiltros(false);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#222222] rounded-t-lg z-40 overflow-y-auto max-h-[90vh] p-4">
      <PanelControlMapa
        boundsCorrientes={boundsCorrientes}
        mapRef={mapRef}
        alerta={alertaMobile}
        setAlerta={setAlertaMobile}
        cargandoUbicacion={false}
        onUbicacionActual={() => {}}
        onAbrirModalReseña={() => {
          window.dispatchEvent(new CustomEvent("abrirModalAgregarReseña"));
          setMostrarFiltros(false); // cerrar panel mobile
        }}
        filtros={filtrosTemporales}
        setFiltros={setFiltrosTemporales}
        zonas={zonas}
        proveedores={proveedores}
        tecnologiasUnicas={tecnologiasUnicas}
        cargandoZonas={cargandoZonas}
        cargandoProveedores={cargandoProveedores}
        cargandoTecnologias={cargandoTecnologias}
        onFiltrar={handleAplicarFiltros}
        onCerrarPanel={() => setMostrarFiltros(false)}
      />
    </div>
  );
};

export default FiltrosMobile;
