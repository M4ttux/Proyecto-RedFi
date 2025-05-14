const herramientas = [
  {
    titulo: "Test de velocidad",
    descripcion:
      "Mide la velocidad actual de tu conexión a Internet. Comprobá si estás recibiendo lo que pagás.",
    disponible: false,
  },
  {
    titulo: "Análisis de señal Wi-Fi (AR)",
    descripcion:
      "Visualizá la intensidad de la señal en tu casa usando realidad aumentada (próximamente en app móvil).",
    disponible: false,
  },
];

const Herramientas = () => {
  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-primario text-center">Herramientas de Red-Fi</h2>
      <p className="text-center text-gray-400 max-w-xl mx-auto">
        Usá nuestras herramientas para analizar tu conexión a Internet y mejorar tu experiencia. Más funciones estarán disponibles pronto.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {herramientas.map((tool, i) => (
          <div
            key={i}
            className="bg-secundario p-6 rounded shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-acento mb-2">{tool.titulo}</h3>
              <p className="text-sm">{tool.descripcion}</p>
            </div>
            <button
              disabled
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded opacity-70 cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Herramientas;
