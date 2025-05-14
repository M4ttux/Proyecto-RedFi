import { useEffect, useState } from "react";
import { obtenerProveedores } from "../services/proveedorService";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    obtenerProveedores().then(setProveedores).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-primario">Lista de Proveedores</h2>
      <ul className="space-y-2">
        {proveedores.map((prov) => (
          <li key={prov._id} className="border-b pb-2">
            <strong>{prov.nombre}</strong> — {prov.tecnologia}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Proveedores;
