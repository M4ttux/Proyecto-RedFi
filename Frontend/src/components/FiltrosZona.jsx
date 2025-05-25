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
import { obtenerReseñas } from "../services/reseñaService";
import { IconChevronDown } from "@tabler/icons-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FiltrosZona = ({ onFiltrar, abrirHaciaArriba = false }) => {
  const [zonas, setZonas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [tecnologiasUnicas, setTecnologiasUnicas] = useState([]);

  const [filtros, setFiltros] = useState({
    zona: null,
    proveedor: null,
    tecnologia: null,
    valoracionMin: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const zonasSupabase = await getZonas();
      const proveedoresSupabase = await obtenerProveedores();
      const valoracionesSupabase = await obtenerReseñas();

      setZonas([null, ...zonasSupabase]);
      setProveedores([null, ...proveedoresSupabase]);
      setValoraciones(valoracionesSupabase);
      setTecnologiasUnicas([
        "",
        ...new Set(proveedoresSupabase.map((p) => p.tecnologia)),
      ]);
    };
    cargarDatos();
  }, []);

  const aplicarFiltros = () => {
    onFiltrar({
      zona: filtros.zona?.id || "",
      proveedor: filtros.proveedor?.id || "",
      tecnologia: filtros.tecnologia || "",
      valoracionMin: filtros.valoracionMin,
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
      abrirHaciaArriba &&
      (label === "Tecnología" || label === "Valoración mínima");

    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-texto">{label}</p>
        <Listbox value={value} onChange={setValue}>
          {({ open }) => (
            <div className="relative">
              <ListboxButton className="relative w-full cursor-pointer bg-texto/10 text-texto py-2 pl-3 pr-10 text-left shadow-md rounded-lg focus:outline-none text-sm">
                <span className="block truncate">
                  {value ? renderOption(value) : placeholder}
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
                    "absolute z-10 max-h-48 w-full overflow-auto bg-fondo text-texto py-1 shadow-lg rounded-lg focus:outline-none text-sm scrollbar-thin",
                    abreArriba ? "bottom-full mb-2" : "top-full mt-1"
                  )}
                >
                  <ListboxOption
                    key="all"
                    className={({ active }) =>
                      classNames(
                        active ? "bg-acento text-white" : "text-texto",
                        "relative cursor-pointer select-none py-2 pl-3 pr-4"
                      )
                    }
                    value={null}
                  >
                    {({ selected }) => (
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "block truncate"
                        )}
                      >
                        {placeholder}
                      </span>
                    )}
                  </ListboxOption>
                  {options.filter(Boolean).map((option) => (
                    <ListboxOption
                      key={option.id || option}
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
    <div className="mb-4 bg-secundario p-4 rounded-md shadow">
      <h3 className="font-semibold mb-2 text-texto">Filtrar resultados</h3>
      <div className="flex flex-col gap-4">
        {/* Zona */}
        {renderListbox(
          "Zona",
          filtros.zona,
          (zona) => setFiltros((prev) => ({ ...prev, zona })),
          zonas,
          (z) => `${z.departamento} - ${z.cabecera}`,
          "Todas las zonas"
        )}

        {/* Proveedor */}
        {renderListbox(
          "Proveedor",
          filtros.proveedor,
          (proveedor) => setFiltros((prev) => ({ ...prev, proveedor })),
          proveedores,
          (p) => p.nombre,
          "Todos los proveedores"
        )}

        {/* Tecnología */}
        {renderListbox(
          "Tecnología",
          filtros.tecnologia,
          (tecnologia) => setFiltros((prev) => ({ ...prev, tecnologia })),
          tecnologiasUnicas,
          (t) => t,
          "Todas las tecnologías"
        )}

        {/* Valoración mínima */}
        {renderListbox(
          "Valoración mínima",
          filtros.valoracionMin,
          (valoracionMin) => setFiltros((prev) => ({ ...prev, valoracionMin })),
          [0, 1, 2, 3, 4, 5],
          (v) => (v === 0 ? "Todas las reseñas" : `${v}★ o más`),
          "Todas las reseñas"
        )}

        <button
          onClick={aplicarFiltros}
          className="bg-primario px-4 py-2 rounded hover:bg-acento text-white font-semibold"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltrosZona;
