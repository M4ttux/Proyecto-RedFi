import { useState } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosZona from "../components/FiltrosZona";

const Mapa = () => {
  const [filtros, setFiltros] = useState(null);

  return (
    <div className="min-h-screen bg-fondo text-texto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-primario mb-6">
        Explorá proveedores por zona
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mx-auto">
        {/* Sidebar - Filtros */}
        <aside className="lg:col-span-3 bg-secundario rounded-lg p-4 shadow-md h-fit">
          <FiltrosZona onFiltrar={setFiltros} />
        </aside>

        {/* Mapa */}
        <section className="lg:col-span-9">
          <MapaInteractivo filtros={filtros} />
        </section>
      </div>
    </div>
  );
};

export default Mapa;
