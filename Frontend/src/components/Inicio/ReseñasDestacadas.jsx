import { IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";

const reseñas = [
  {
    nombre: "Juan P.",
    comentario:
      "Excelente velocidad y atención al cliente. Desde que me cambié, no tuve más interrupciones ni caídas.",
    estrellas: 5,
  },
  {
    nombre: "Ana G.",
    comentario:
      "En general anda bien, pero en horas pico suele bajar bastante la velocidad y tarda en cargar videos.",
    estrellas: 4,
  },
  {
    nombre: "Martin M.",
    comentario:
      "Se me corta todos los días alrededor de las 21 hs. Ya hice varios reclamos y no tuve respuesta.",
    estrellas: 1,
  },
  {
    nombre: "Agustina M.",
    comentario:
      "Antes funcionaba muy bien, pero en los últimos meses hubo varios aumentos y el servicio bajó la calidad.",
    estrellas: 2,
  },
  {
    nombre: "Sofía T.",
    comentario:
      "Me sorprendió la estabilidad. Incluso con varios dispositivos conectados, no se cae ni pierde velocidad.",
    estrellas: 5,
  },
  {
    nombre: "Lucas R.",
    comentario:
      "El servicio es aceptable. Tiene buena cobertura en mi zona, aunque algunas veces se ralentiza con videollamadas.",
    estrellas: 3,
  },
];

const ReseñasDestacadas = () => {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-texto">Reseñas destacadas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {reseñas.map((r, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-lg text-center"
            >
              <img
                src={`https://randomuser.me/api/portraits/${
                  i % 2 === 0 ? "men" : "women"
                }/${i}.jpg`}
                alt={r.nombre}
                className="w-24 h-24 rounded-full object-cover border border-white/20 mb-3"
              />
              <p className="text-acento font-bold mb-2">{r.nombre}</p>

              <p className="text-texto italic mb-4">
                “{r.comentario}”
              </p>

              <div className="flex gap-1 text-yellow-400 justify-center">
                {Array.from({ length: 5 }, (_, idx) =>
                  idx < r.estrellas ? (
                    <IconCarambolaFilled size={14} key={idx} />
                  ) : (
                    <IconCarambola size={14} key={idx} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
