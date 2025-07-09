import { IconX, IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import PanelControlMapa from "../PanelControlMapa";
import MainButton from "../../ui/MainButton";
import MainH3 from "../../ui/MainH3";
import Select from "../../ui/Select";

const FiltrosZona = ({
  filtros,
  setFiltros,
  onFiltrar,
  setMostrarFiltros,
  zonas,
  proveedores,
  tecnologiasUnicas,
  cargandoZonas,
  cargandoProveedores,
  cargandoTecnologias,
  mapRef,
  boundsCorrientes,
  cargandoUbicacion,
  onUbicacionActual,
  onAbrirModalReseña,
}) => {
  const [alerta, setAlerta] = useState("");
  const aplicarFiltros = () => {
    onFiltrar({
      zona: filtros.zona.id || "",
      proveedor: filtros.proveedor.id || "",
      tecnologia: filtros.tecnologia || "",
      valoracionMin: filtros.valoracionMin || 0,
    });
  };

  return (
    <div className="bg-[#222222] px-6 py-6 rounded-lg">
      <div className="pb-4">
        <div className="flex justify-between items-center">
          <MainH3 className="mb-0 lg:mb-4">Buscar ubicación</MainH3>
          <MainButton
            type="button"
            onClick={() => setMostrarFiltros(false)}
            variant="cross"
            className="lg:hidden px-0"
          >
            <IconX size={24} />
          </MainButton>
        </div>
        {/* <div className="border-t border-white/10 my-2" /> */}
        <div>
          <PanelControlMapa
            boundsCorrientes={boundsCorrientes}
            alerta={alerta}
            setAlerta={setAlerta}
            mapRef={mapRef}
            cargandoUbicacion={cargandoUbicacion}
            onUbicacionActual={onUbicacionActual}
            onAbrirModalReseña={onAbrirModalReseña}
          />
        </div>
      </div>
      <div className="pb-4">
        <MainH3>Filtrar resultados</MainH3>
        <div className="flex flex-col gap-4">
          <Select
            label="Zona"
            value={filtros.zona?.id || ""}
            onChange={(id) => {
              const zona = zonas.find((z) => String(z.id) === String(id)) || {
                id: "",
                nombre: "Todas las zonas",
              };
              setFiltros((prev) => ({ ...prev, zona }));
            }}
            options={zonas}
            getOptionValue={(z) => z.id}
            getOptionLabel={(z) => z.departamento || z.nombre}
            loading={cargandoZonas}
          />
          <Select
            label="Proveedor"
            value={filtros.proveedor?.id || ""}
            onChange={(id) => {
              const proveedor = proveedores.find((p) => p.id === id) || {
                id: "",
                nombre: "Todos los proveedores",
              };
              setFiltros((prev) => ({ ...prev, proveedor }));
            }}
            options={proveedores}
            getOptionValue={(p) => p.id}
            getOptionLabel={(p) => p.nombre}
            loading={cargandoProveedores}
          />
          <Select
            label="Tecnología"
            value={filtros.tecnologia || ""}
            onChange={(t) => setFiltros((prev) => ({ ...prev, tecnologia: t }))}
            options={tecnologiasUnicas}
            getOptionValue={(t) => t}
            getOptionLabel={(t) => t || "Todas las tecnologías"}
            loading={cargandoTecnologias}
          />
        </div>
      </div>
      <div className="pb-4">
        <p className="block text-texto mb-1">Valoración exacta</p>
        <div className="flex items-center gap-3">
          {/* Botón "Todas" */}
          <button
            type="button"
            onClick={() =>
              setFiltros((prev) => ({ ...prev, valoracionMin: 0 }))
            }
            className={`px-3 py-1 rounded-lg text-sm font-medium border transition
        ${
          filtros.valoracionMin === 0
            ? "bg-acento text-white border-acento"
            : "bg-white/5 text-white/70 border-white/20 hover:bg-white/10"
        }`}
          >
            Todas
          </button>

          {/* Estrellas */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => {
              const isActive = filtros.valoracionMin >= v;
              const StarIcon = isActive ? IconCarambolaFilled : IconCarambola;

              return (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, valoracionMin: v }))
                  }
                  className="p-1"
                  title={`${v} estrella${v > 1 ? "s" : ""}`}
                >
                  <StarIcon
                    size={24}
                    className={`transition hover:scale-110 ${
                      isActive ? "text-acento" : "text-white/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <MainButton onClick={aplicarFiltros} variant="accent">
        Aplicar filtros
      </MainButton>
    </div>
  );
};

export default FiltrosZona;
