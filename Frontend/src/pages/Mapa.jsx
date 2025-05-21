import { useState, useEffect } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosZona from "../components/FiltrosZona";

const Mapa = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);
  const [filtros, setFiltros] = useState(null);

  return (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 mx-auto h-full">
        {/* Sidebar - Filtros */}
        <aside className="lg:col-span-3 bg-secundario p-4 shadow-md h-full ">
          <FiltrosZona onFiltrar={setFiltros} />
        </aside>

        {/* Mapa */}
        <section className="lg:col-span-9 h-full">
          <MapaInteractivo filtros={filtros} />
        </section>
      </div>
    </div>
  );
};

export default Mapa;
