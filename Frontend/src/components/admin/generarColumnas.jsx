import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";

export const generarColumnas = (tabla, datos, acciones = {}) => {
  if (!datos.length) return [];

  const ejemplo = datos[0];

  const columnasBase = [];

  if (tabla === "proveedores") {
    columnasBase.push(
      { id: "nombre", label: "NOMBRE", renderCell: (row) => row.nombre },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => row.descripcion || "—",
      },
      {
        id: "sitio_web",
        label: "SITIO WEB",
        renderCell: (row) => row.sitio_web || "—",
      },
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) =>
          Array.isArray(row.tecnologia) && row.tecnologia.length > 0
            ? row.tecnologia.join(", ")
            : "—",
      },
      {
        id: "color",
        label: "COLOR",
        renderCell: (row) => (
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: row.color }}
          />
        ),
      }
    );
  } else if (tabla === "reseñas") {
    columnasBase.push(
      {
        id: "user_profiles",
        label: "USUARIOS",
        renderCell: (row) => row.user_profiles?.nombre || "—",
      },
      {
        id: "proveedores",
        label: "PROVEEDORES",
        renderCell: (row) => row.proveedores?.nombre || "—",
      },
      {
        id: "estrellas",
        label: "ESTRELLAS",
        renderCell: (row) => (
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) =>
              i < row.estrellas ? (
                <IconCarambolaFilled
                  key={i}
                  size={18}
                  className="text-yellow-400"
                />
              ) : (
                <IconCarambola key={i} size={18} className="text-yellow-400" />
              )
            )}
          </div>
        ),
      },
      {
        id: "comentario",
        label: "COMENTARIO",
        renderCell: (row) => (
          <div className="max-w-[250px] truncate text-ellipsis overflow-hidden" title={row.comentario}>
            {row.comentario || "—"}
          </div>
        ),
      }
    );
  } else if (tabla === "tecnologias") {
    columnasBase.push(
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) => row.tecnologia,
      },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => row.descripcion || "—",
      }
    );
  } else {
    const keys = Object.keys(ejemplo);
    keys.forEach((key) => {
      columnasBase.push({
        id: key,
        label: key.toUpperCase(),
        renderCell: (row) => row[key]?.toString?.() || "—",
      });
    });
  }

  // Agregar columna de acciones si se proveen funciones
  if (acciones.onVer || acciones.onEditar || acciones.onEliminar) {
    columnasBase.push({
      id: "acciones",
      label: "ACCIONES",
      renderCell: (row) => (
        <div className="flex flex-wrap gap-2">
          {acciones.onVer && (
            <MainButton
              onClick={() => acciones.onVer(row)}
              title="Ver"
              variant="see"
            >
              Ver
            </MainButton>
          )}
          {acciones.onEditar && (
            <MainButton
              onClick={() => acciones.onEditar(row)}
              title="Editar"
              variant="edit"
            >
              Editar
            </MainButton>
          )}
          {acciones.onEliminar && (
            <MainButton
              onClick={() => acciones.onEliminar(row)}
              title="Eliminar"
              variant="delete"
            >
              Eliminar
            </MainButton>
          )}
        </div>
      ),
    });
  }

  return columnasBase;
};
