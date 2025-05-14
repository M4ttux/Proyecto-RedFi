import IconMap from "../../icons/Map";
import IconOpinion from "../../icons/Opinion";
import IconTool from "../../icons/Tool";

const features = [
  {
    icono: <IconMap width={80} height={80} />,
    titulo: "Mapa Interactivo",
    descripcion: "Visualizá qué proveedores están disponibles en tu zona con un mapa fácil de usar y visualmente claro.",
  },
  {
    icono: <IconOpinion width={80} height={80} />,
    titulo: "Reseñas Reales",
    descripcion: "Leé reseñas de usuarios reales y descubrí qué tan bien funciona cada proveedor en tu barrio.",
  },
  {
    icono: <IconTool width={80} height={80} />,
    titulo: "Elección Inteligente",
    descripcion: "Usá nuestro test de velocidad y análisis Wi-Fi para entender el estado de tu conexión actual.",
  },
];

const Caracteristicas = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <h2 className="text-3xl font-bold text-texto">
          ¿Por qué elegir Red-Fi?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-secundario/40  p-6 rounded shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-3 text-acento">
                {f.icono}
              </div>
              <h3 className="text-xl font-semibold text-acento mb-2">
                {f.titulo}
              </h3>
              <p className="text-texto">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Caracteristicas;
