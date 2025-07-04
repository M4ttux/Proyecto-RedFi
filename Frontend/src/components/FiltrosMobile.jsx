import FiltrosZona from "./FiltrosZona";
import { IconX } from "@tabler/icons-react";
import MainButton from "./ui/MainButton";

const FiltrosMobile = ({ filtrosTemporales, setFiltrosTemporales, setFiltrosAplicados, setMostrarFiltros }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-secundario p-4 rounded-t-lg shadow-lg z-40 max-h-[60vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <p className="font-bold text-texto text-lg">Filtros</p>
        <MainButton
          type = "button"
          onClick={() => setMostrarFiltros(false)}
          variant="cross"
        >
          <IconX size={24} />
        </MainButton>
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
