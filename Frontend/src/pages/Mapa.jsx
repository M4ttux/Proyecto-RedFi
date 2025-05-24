import { useState, useEffect } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosZona from "../components/FiltrosZona";
import { IconX, IconSettings, IconCurrentLocation } from "@tabler/icons-react";
import { DURACION_ALERTA } from "../constantes";

const Mapa = () => {
  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);

  const [filtros, setFiltros] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  return (
    <div className="h-[calc(100vh-72px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 h-full relative">
        {/* Sidebar en desktop */}
        <aside className="hidden lg:block lg:col-span-3 bg-secundario p-4 shadow-md h-full z-10 overflow-y-auto">
          <FiltrosZona onFiltrar={setFiltros} />
        </aside>

        {/* Mapa principal */}
        <section className="col-span-1 lg:col-span-9 h-full relative">
          <MapaInteractivo filtros={filtros} />

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

                // Reestablece después de un delay de seguridad
                setTimeout(
                  () => setCargandoUbicacion(false),
                  DURACION_ALERTA + 1000
                );
              }}
              className={`p-3 rounded-full shadow-md transition
                ${
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

          {/* Panel flotante para filtros (estilo bottom-sheet) */}
          {mostrarFiltros && (
            <div className="absolute bottom-0 left-0 w-full bg-secundario p-4 rounded-t-xl shadow-lg z-40 max-h-[60vh] overflow-y-auto">
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
                onFiltrar={(f) => {
                  setFiltros(f);
                  setMostrarFiltros(false);
                }}
                abrirHaciaArriba={true}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Mapa;
