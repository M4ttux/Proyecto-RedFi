import {
  IconMapPinCheck,
  IconTools,
  IconQuote,
  IconReceipt,
} from "@tabler/icons-react";

const features = [
  {
    icono: <IconMapPinCheck size={64} />,
    titulo: "Cobertura Geolocalizada",
    descripcion:
      "Explorá el mapa interactivo de Corrientes y descubrí qué proveedores ofrecen servicio en tu zona exacta.",
  },
  {
    icono: <IconQuote size={64} />,
    titulo: "Opiniones Verificadas",
    descripcion:
      "Leé reseñas auténticas de usuarios reales y evitá sorpresas. Conocé las experiencias reales en tu barrio.",
  },
  {
    icono: <IconTools size={64} />,
    titulo: "Herramientas Inteligentes",
    descripcion:
      "Medí la velocidad de tu conexión, analizá la latencia y accedé a métricas clave para evaluar tu proveedor.",
  },
  {
    icono: <IconReceipt size={64} />,
    titulo: "Guardado de Boletas",
    descripcion:
      "Guardá tus boletas y recibí notificaciones antes del vencimiento. Además, podés verificar si hubo aumentos en el monto mes a mes.",
  },
];

const Caracteristicas = () => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-fondo">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-texto">
            ¿Por qué elegir <span className="text-acento">Red-Fi</span>?
          </h2>
          <p className="max-w-2xl mx-auto text-texto leading-relaxed">
            Red-Fi te permite tomar decisiones informadas al momento de elegir
            un proveedor de internet. Ya sea que busques velocidad, estabilidad
            o una buena atención al cliente, acá vas a encontrar lo que
            necesitás.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="w-full max-w-[320px] sm:max-w-none mx-auto sm:mx-0 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-lg"
            >
              <div className="flex justify-center mb-4 sm:mb-5 text-acento">
                <div className="transition-transform transform hover:scale-110 duration-300">
                  {f.icono}
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-acento mb-2">
                {f.titulo}
              </h3>
              <p className="text-texto leading-relaxed">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Caracteristicas;
