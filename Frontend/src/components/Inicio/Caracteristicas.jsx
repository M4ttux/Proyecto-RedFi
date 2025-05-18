import { IconMapPinCheck } from '@tabler/icons-react';
import { IconTools } from '@tabler/icons-react';
import { IconQuoteFilled } from '@tabler/icons-react';

const features = [
  {
    icono: <IconMapPinCheck size={80} />,
    titulo: "Cobertura geolocalizada",
    descripcion:
      "Explorá un mapa interactivo que muestra la disponibilidad real de cada proveedor en tu zona.",
  },
  {
    icono: <IconQuoteFilled size={80} />,
    titulo: "Opiniones verificadas",
    descripcion:
      "Accedé a comentarios reales de usuarios y descubrí qué proveedor ofrece la mejor experiencia en tu barrio.",
  },
  {
    icono: <IconTools size={80} />,
    titulo: "Herramientas integradas",
    descripcion:
      "Realizá tests de velocidad, analizá tu conexión y obtené datos clave para tomar decisiones informadas.",
  },
];

const Caracteristicas = () => {
  return (
    <section className="py-20 px-6 bg-fondo">
      <div className="max-w-6xl mx-auto text-center space-y-14">
        <h2 className="text-4xl font-bold text-texto">
          ¿Por qué elegir Red-Fi?
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4 text-acento transition-transform duration-300 hover:scale-110">
                {f.icono}
              </div>
              <h3 className="text-xl font-semibold text-acento mb-3">
                {f.titulo}
              </h3>
              <p className="text-texto text-sm leading-relaxed">
                {f.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Caracteristicas;
