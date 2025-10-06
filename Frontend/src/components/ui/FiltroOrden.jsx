// Frontend/src/components/ui/FiltroOrden.jsx
import { IconArrowsSort, IconSearch } from "@tabler/icons-react";
import classNames from "classnames";
import { useTheme } from "../../context/ThemeContext";

const FiltroOrden = ({
  filtro,
  setFiltro,
  ordenCampo,
  setOrdenCampo,
  ordenDir,
  setOrdenDir,
  opcionesOrden = [],
  placeholder = "Buscar…",
}) => {
  const { currentTheme } = useTheme();

  const baseBox = classNames(
    "flex items-center gap-2 rounded-xl backdrop-blur-md shadow-md",
    currentTheme === "light"
      ? "bg-secundario border-2 border-texto/15"
      : "bg-secundario/50 border border-texto/25"
  );

  const baseInput = classNames(
    "w-full px-3 py-2 rounded-xl text-sm font-medium outline-none bg-transparent"
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 mb-4">
      {/* Filtro - Ocupa el espacio restante después de los selects */}
      <div className={classNames(baseBox, "flex-1 relative px-3 justify-center")}>
        <IconSearch className="h-5 w-5 opacity-70 absolute left-3 pointer-events-none" />
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder={placeholder}
          className={classNames(baseInput, "pl-9")}
        />
      </div>

      {/* Select campo - 20% del ancho en desktop */}
      <div className={classNames(baseBox, "px-3 flex-1 sm:flex-none sm:w-[20%]")}>
        <IconArrowsSort className="h-5 w-5 opacity-70 flex-shrink-0" />
        <select
          value={ordenCampo}
          onChange={(e) => setOrdenCampo(e.target.value)}
          className={classNames(baseInput, "w-full bg-transparent min-w-0")}
        >
          {opcionesOrden.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-fondo text-texto"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Select dirección - 20% del ancho en desktop */}
      <div className={classNames(baseBox, "px-3 flex-1 sm:flex-none sm:w-[20%]")}>
        <select
          value={ordenDir}
          onChange={(e) => setOrdenDir(e.target.value)}
          className={classNames(baseInput, "w-full bg-transparent min-w-0")}
        >
          <option value="asc" className="bg-fondo text-texto">
            Ascendente
          </option>
          <option value="desc" className="bg-fondo text-texto">
            Descendente
          </option>
        </select>
      </div>
    </div>
  );
};

export default FiltroOrden;
