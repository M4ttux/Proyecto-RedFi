export const proveedores = [
  {
    id: "fibertel",
    nombre: "Fibertel",
    tecnologia: "HFC",
    color: "#007bff",
    zona: [
      [-27.4715, -58.8352],
      [-27.4725, -58.8278],
      [-27.477, -58.8292],
      [-27.476, -58.8372],
    ],
    reseñas: [
      {
        id: 1,
        coords: [-27.4735, -58.832],
        usuario: "Juan Pérez",
        estrellas: 4,
        comentario: "Buena conexión, pero a veces se corta.",
      },
    ],
  },
  {
    id: "telecom",
    nombre: "Telecom",
    tecnologia: "Fibra óptica",
    color: "#28a745",
    zona: [
      [-27.4785, -58.8365],
      [-27.4795, -58.828],
      [-27.483, -58.829],
      [-27.482, -58.8378],
    ],
    reseñas: [
      {
        id: 2,
        coords: [-27.4802, -58.8325],
        usuario: "María Gómez",
        estrellas: 5,
        comentario: "Muy estable, recomendadísimo.",
      },
    ],
  },
];
