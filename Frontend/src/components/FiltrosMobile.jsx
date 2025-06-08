import FiltrosZona from "./FiltrosZona";
import { IconX } from "@tabler/icons-react";

const FiltrosMobile = ({ filtrosTemporales, setFiltrosTemporales, setFiltrosAplicados, setMostrarFiltros }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-secundario p-4 rounded-t-lg shadow-lg z-40 max-h-[60vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-texto text-lg">Filtros</p>
        <button
          onClick={() => setMostrarFiltros(false)}
          className="text-acento font-bold"
        >
          <IconX size={24} />
        </button>
      </div>
      <FiltrosZona
        filtros={filtrosTemporales}
        setFiltros={setFiltrosTemporales}
        onFiltrar={(f) => {
          setFiltrosAplicados(f);
          setMostrarFiltros(false);
        }}
        abrirHaciaArriba={true}
      />
    </div>
  );
};

export default FiltrosMobile;
