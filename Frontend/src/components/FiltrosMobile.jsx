import FiltrosZona from "./FiltrosZona";

const FiltrosMobile = ({
  filtrosTemporales,
  setFiltrosTemporales,
  setFiltrosAplicados,
  setMostrarFiltros,
  zonas,
  proveedores,
  tecnologiasUnicas,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#222222] rounded-t-lg z-40 overflow-y-auto">
      <FiltrosZona
        filtros={filtrosTemporales}
        setFiltros={setFiltrosTemporales}
        onFiltrar={(f) => {
          setFiltrosAplicados(f);
          setMostrarFiltros(false);
        }}
        abrirHaciaArriba={true}
        setMostrarFiltros={setMostrarFiltros}
        zonas={zonas}
        proveedores={proveedores}
        tecnologiasUnicas={tecnologiasUnicas}
      />
    </div>
  );
};

export default FiltrosMobile;
