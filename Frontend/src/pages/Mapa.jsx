import { useState, useEffect } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosZona from "../components/FiltrosZona";

/* const Mapa = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);
  const [filtros, setFiltros] = useState(null);

  return (
    <div className="h-[calc(100vh-72px)] w-full overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-12 h-full">
        
        <aside className="lg:col-span-3 bg-secundario p-3 shadow-md relative z-20 max-h-[35vh] overflow-y-auto text-sm space-y-2 lg:max-h-full lg:text-base">
  <FiltrosZona onFiltrar={setFiltros} />
</aside>


        
        <section className="lg:col-span-9 flex-1 h-full">
          <MapaInteractivo filtros={filtros} />
        </section>
      </div>
    </div>
  );
};

export default Mapa; */

const Mapa = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);

  const [filtros, setFiltros] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  return (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full relative">
        {/* Sidebar visible en desktop */}
        <aside className="hidden lg:block lg:col-span-3 bg-secundario p-4 shadow-md h-full z-10">
          <FiltrosZona onFiltrar={setFiltros} />
        </aside>

        {/* Mapa */}
        <section className="col-span-1 lg:col-span-9 h-full relative">
          {/* Botón flotante en mobile */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="lg:hidden absolute top-50 left-4 z-20 bg-primario text-white px-4 py-2 rounded shadow hover:bg-acento transition"
          >
            {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
          </button>

          {/* Filtros como panel flotante en mobile */}
          {mostrarFiltros && (
            <div className="absolute top-62 left-4 w-[90vw] max-w-sm bg-secundario p-4 rounded-md shadow-lg z-30">
              <FiltrosZona onFiltrar={(f) => { setFiltros(f); setMostrarFiltros(false); }} />
            </div>
          )}

          <MapaInteractivo filtros={filtros} />
        </section>
      </div>
    </div>
  );
};

export default Mapa;