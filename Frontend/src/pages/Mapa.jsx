import { useState, useEffect, useRef } from "react";
import MapaInteractivo from "../components/MapaInteractivo";
import FiltrosMobile from "../components/FiltrosMobile";
import FiltrosZona from "../components/FiltrosZona";
import { IconFilter, IconCurrentLocation } from "@tabler/icons-react";
import { getZonas } from "../services/zonaService";
import { obtenerProveedores } from "../services/proveedorService";
import { DURACION_ALERTA } from "../constantes";

const Mapa = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    document.title = "Red-Fi | Mapa";
  }, []);

  // 👉 Ocultar filtros mobile si ancho >= 1024px
  useEffect(() => {
    const manejarResize = () => {
      if (window.innerWidth >= 1024) {
        setMostrarFiltros(false);
      }
    };

    window.addEventListener("resize", manejarResize);
    manejarResize(); // Ejecutar al montar

    return () => {
      window.removeEventListener("resize", manejarResize);
    };
  }, []);

  const [cargandoZonas, setCargandoZonas] = useState(true);
  const [cargandoProveedores, setCargandoProveedores] = useState(true);
  const [cargandoTecnologias, setCargandoTecnologias] = useState(true);

  const [zonas, setZonas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [tecnologiasUnicas, setTecnologiasUnicas] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoZonas(true);
      setCargandoProveedores(true);
      setCargandoTecnologias(true);

      const zonasSupabase = await getZonas();
      const proveedoresSupabase = await obtenerProveedores();

      const zonasConProveedor = new Set(
        proveedoresSupabase.map((p) => p.zona_id).filter(Boolean)
      );

      const zonasFiltradas = zonasSupabase.filter((z) =>
        zonasConProveedor.has(z.id)
      );

      setZonas([{ id: "", nombre: "Todas las zonas" }, ...zonasFiltradas]);
      setCargandoZonas(false);

      setProveedores([
        { id: "", nombre: "Todos los proveedores" },
        ...proveedoresSupabase,
      ]);
      setCargandoProveedores(false);

      setTecnologiasUnicas([
        "",
        ...new Set(proveedoresSupabase.map((p) => p.tecnologia)),
      ]);
      setCargandoTecnologias(false);
    };

    cargarDatos();
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
        <aside className="hidden lg:block lg:col-span-3 bg-[#222222] h-full z-10 overflow-y-auto">
          <FiltrosZona
            filtros={filtrosTemporales}
            setFiltros={setFiltrosTemporales}
            onFiltrar={(f) => setFiltrosAplicados(f)}
            setMostrarFiltros={setMostrarFiltros}
            zonas={zonas}
            proveedores={proveedores}
            tecnologiasUnicas={tecnologiasUnicas}
            cargandoZonas={cargandoZonas}
            cargandoProveedores={cargandoProveedores}
            cargandoTecnologias={cargandoTecnologias}
          />
        </aside>

        {/* Mapa principal */}
        <section className="col-span-1 lg:col-span-9 h-full relative">
          <MapaInteractivo
            filtros={filtrosAplicados}
            mapContainerRef={mapContainerRef}
          />

          {/* Botones flotantes mobile */}
          <div className="lg:hidden absolute bottom-4 right-4 flex flex-col gap-3 z-30">
            <button
              onClick={() => setMostrarFiltros(true)}
              className="bg-primario p-3 rounded-full shadow-md hover:bg-acento transition"
              title="Filtros"
            >
              <IconFilter className="text-white" />
            </button>

            <button
              onClick={() => {
                setCargandoUbicacion(true);
                const evento = new CustomEvent("solicitarUbicacion");
                window.dispatchEvent(evento);

                setTimeout(
                  () => setCargandoUbicacion(false),
                  DURACION_ALERTA + 1000
                );
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
              zonas={zonas}
              proveedores={proveedores}
              tecnologiasUnicas={tecnologiasUnicas}
              cargandoZonas={cargandoZonas}
              cargandoProveedores={cargandoProveedores}
              cargandoTecnologias={cargandoTecnologias}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Mapa;
