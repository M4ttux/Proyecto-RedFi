import { useState, useEffect, useRef } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosMobile from "../components/FiltrosMobile";
import FiltrosZona from "../components/FiltrosZona";
import { IconSettings, IconCurrentLocation } from "@tabler/icons-react";
import { DURACION_ALERTA } from "../constantes";

const Mapa = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    zona: "",
    proveedor: "",
    tecnologia: "",
    valoracionMin: 0,
  });

  const [filtrosTemporales, setFiltrosTemporales] = useState({
    zona: { id: "", nombre: "Todas las zonas" },
    proveedor: { id: "", nombre: "Todos los proveedores" },
    tecnologia: "",
    valoracionMin: 0,
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  return (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full relative">
        {/* Sidebar en desktop */}
        <aside className="hidden lg:block lg:col-span-3 bg-secundario p-4 shadow-md h-full z-10 overflow-y-auto">
          <FiltrosZona
            filtros={filtrosTemporales}
            setFiltros={setFiltrosTemporales}
            onFiltrar={(f) => setFiltrosAplicados(f)}
          />
        </aside>

        {/* Mapa principal */}
        <section className="col-span-1 lg:col-span-9 h-full relative">
          <MapaInteractivo filtros={filtrosAplicados} mapContainerRef={mapContainerRef} />

          {/* Botones flotantes mobile */}
          <div className="lg:hidden absolute bottom-4 right-4 flex flex-col gap-3 z-30">
            <button
              onClick={() => setMostrarFiltros(true)}
              className="bg-primario p-3 rounded-full shadow-md hover:bg-acento transition"
              title="Filtros"
            >
              <IconSettings className="text-white" />
            </button>

            <button
              onClick={() => {
                setCargandoUbicacion(true);
                const evento = new CustomEvent("solicitarUbicacion");
                window.dispatchEvent(evento);

                setTimeout(() => setCargandoUbicacion(false), DURACION_ALERTA + 1000);
              }}
              className={`p-3 rounded-full shadow-md transition ${
                cargandoUbicacion
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-primario hover:bg-acento"
              }`}
              disabled={cargandoUbicacion}
              title="Ubicación actual"
            >
              <IconCurrentLocation className="text-white" />
            </button>
          </div>

          {/* Panel flotante para filtros (mobile) */}
          {mostrarFiltros && (
            <FiltrosMobile
              filtrosTemporales={filtrosTemporales}
              setFiltrosTemporales={setFiltrosTemporales}
              setFiltrosAplicados={setFiltrosAplicados}
              setMostrarFiltros={setMostrarFiltros}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Mapa;
