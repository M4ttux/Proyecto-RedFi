import { useState, useEffect, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { getZonas } from "../services/zonaService";
import { obtenerProveedores } from "../services/proveedorService";
import { IconChevronDown } from "@tabler/icons-react";
import MainButton from "./ui/MainButton";
import MainH3 from "./ui/MainH3";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FiltrosZona = ({ filtros, setFiltros, onFiltrar, abrirHaciaArriba = false }) => {
  const [zonas, setZonas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [tecnologiasUnicas, setTecnologiasUnicas] = useState([]);

  useEffect(() => {
  const cargarDatos = async () => {
    const zonasSupabase = await getZonas();
    const proveedoresSupabase = await obtenerProveedores();

    // Obtener los IDs de zona usados por al menos un proveedor
    const zonasConProveedor = new Set(
      proveedoresSupabase.map((p) => p.zona_id).filter(Boolean)
    );

    // Filtrar las zonas que tienen proveedores
    const zonasFiltradas = zonasSupabase.filter((z) =>
      zonasConProveedor.has(z.id)
    );

    // Agregar la opción "Todas las zonas"
    setZonas([{ id: "", nombre: "Todas las zonas" }, ...zonasFiltradas]);

    setProveedores([
      { id: "", nombre: "Todos los proveedores" },
      ...proveedoresSupabase,
    ]);

    setTecnologiasUnicas([
      "",
      ...new Set(proveedoresSupabase.map((p) => p.tecnologia)),
    ]);
  };

  cargarDatos();
}, []);


  const aplicarFiltros = () => {
    onFiltrar({
      zona: filtros.zona.id || "",
      proveedor: filtros.proveedor.id || "",
      tecnologia: filtros.tecnologia || "",
      valoracionMin: filtros.valoracionMin || 0,
    });
  };

  const renderListbox = (
    label,
    value,
    setValue,
    options,
    renderOption,
    placeholder
  ) => {
    const abreArriba =
      abrirHaciaArriba && (label === "Tecnología" || label === "Valoración exacta");

    return (
      <div className="space-y-1">
        <p className="font-medium text-texto">{label}</p>
        <Listbox value={value} onChange={setValue}>
          {({ open }) => (
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg">
                <span className="block truncate">
                  {renderOption(value) || placeholder}
                </span>
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                >
                  <IconChevronDown />
                </div>
              </ListboxButton>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions
                  modal={false}
                  className={classNames(
                    "absolute z-10 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none scrollbar-thin",
                    abreArriba ? "bottom-full mb-2" : "top-full mt-1"
                  )}
                >
                  {options.map((option) => (
                    <ListboxOption
                      key={option.id || option || "default"}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-acento text-white" : "text-texto",
                          "relative cursor-pointer select-none py-2 pl-3 pr-4"
                        )
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {renderOption(option)}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    );
  };

  return (
    <div className="mb-4 bg-secundario p-4 rounded-lg shadow">
      <MainH3>Filtrar resultados</MainH3>
      <div className="flex flex-col gap-4">
        {/* Separador visual */}
        <div className="border-t border-white/10 my-2" />
        <p className="text-sm text-white/60 -mt-2 mb-1">Filtrar proveedores</p>
        {renderListbox(
          "Zona",
          filtros.zona,
          (zona) => setFiltros((prev) => ({ ...prev, zona })),
          zonas,
          (z) => (z.departamento ? `${z.departamento} - ${z.cabecera}` : z.nombre),
          "Todas las zonas"
        )}

        {renderListbox(
          "Proveedor",
          filtros.proveedor,
          (proveedor) => setFiltros((prev) => ({ ...prev, proveedor })),
          proveedores,
          (p) => p.nombre,
          "Todos los proveedores"
        )}

        {renderListbox(
          "Tecnología",
          filtros.tecnologia,
          (tecnologia) => setFiltros((prev) => ({ ...prev, tecnologia })),
          tecnologiasUnicas,
          (t) => (t || "Todas las tecnologías"),
          "Todas las tecnologías"
        )}

        {/* Separador visual */}
        <div className="border-t border-white/10 my-2" />
        <p className="text-sm text-white/60 -mt-2 mb-1">Filtrar reseñas</p>

        {renderListbox(
          "Valoración exacta",
          filtros.valoracionMin,
          (valoracionMin) => setFiltros((prev) => ({ ...prev, valoracionMin })),
          [0, 1, 2, 3, 4, 5],
          (v) => (v === 0 ? "Todas las estrellas" : `${v}★`),
          "Todas las estrellas"
        )}

        <MainButton
          onClick={aplicarFiltros}
          variant="primary"
        >
          Aplicar filtros
        </MainButton>          
      </div>
    </div>
  );
};

export default FiltrosZona;