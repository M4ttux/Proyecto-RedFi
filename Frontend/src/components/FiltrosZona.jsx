import { useState, useEffect } from "react";
import { getZonas } from "../services/zonaService";
import { obtenerProveedores } from "../services/proveedorService";

const FiltrosZona = ({ onFiltrar }) => {
  const [filtros, setFiltros] = useState({
    proveedor: "",
    tecnologia: "",
    valoracionMin: 0,
    zona: "",
  });

  const [zonas, setZonas] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const zonasSupabase = await getZonas();
      const proveedoresSupabase = await obtenerProveedores();
      setZonas(zonasSupabase);
      setProveedores(proveedoresSupabase);
    };
    cargarDatos();
  }, []);

  const tecnologiasUnicas = [
    ...new Set(proveedores.map((p) => p.tecnologia)),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const aplicarFiltros = () => {
    onFiltrar(filtros);
  };

  return (
    <div className="mb-4 bg-secundario p-4 rounded-md shadow">
      <h3 className="font-semibold mb-2">Filtrar resultados</h3>
      <div className="flex flex-col gap-4">
        {/* Zona */}
        <select
          name="zona"
          value={filtros.zona}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.departamento} - {z.cabecera}
            </option>
          ))}
        </select>

        {/* Proveedor */}
        <select
          name="proveedor"
          value={filtros.proveedor}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todos los proveedores</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* Tecnología */}
        <select
          name="tecnologia"
          value={filtros.tecnologia}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          <option value="">Todas las tecnologías</option>
          {tecnologiasUnicas.map((tec) => (
            <option key={tec} value={tec}>
              {tec}
            </option>
          ))}
        </select>

        {/* Valoración mínima */}
        <select
          name="valoracionMin"
          value={filtros.valoracionMin}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v}★ o más
            </option>
          ))}
        </select>

        <button
          onClick={aplicarFiltros}
          className="bg-primario px-4 py-1 rounded hover:bg-acento"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FiltrosZona;
