import {
  IconCarambola,
  IconCarambolaFilled,
} from "@tabler/icons-react";

export const generarColumnas = (tabla, datos) => {
  if (!datos.length) return [];

  const ejemplo = datos[0];

  if (tabla === "proveedores") {
    return [
      {
        id: "nombre",
        label: "NOMBRE",
        renderCell: (row) => row.nombre,
      },
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
      },
    ];
  }

  if (tabla === "reseñas") {
    return [
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
                <IconCarambola
                  key={i}
                  size={18}
                  className="text-yellow-400"
                />
              )
            )}
          </div>
        ),
      },
      {
        id: "comentario",
        label: "COMENTARIO",
        renderCell: (row) => row.comentario,
      },
    ];
  }

  if (tabla === "tecnologias") {
    return [
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) => row.tecnologia,
      },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => row.descripcion || "—",
      },
    ];
  }

  const keys = Object.keys(ejemplo);
  return keys.map((key) => ({
    id: key,
    label: key.toUpperCase(),
    renderCell: (row) => row[key]?.toString?.() || "—",
  }));
};
