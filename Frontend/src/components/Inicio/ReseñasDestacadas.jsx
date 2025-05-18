import { IconCarambolaFilled } from "@tabler/icons-react";
import { IconCarambola } from "@tabler/icons-react";

const reseñas = [
  {
    nombre: "Juan P.",
    comentario: "Excelente velocidad y atención al cliente. Muy recomendable.",
    estrellas: 5,
  },
  {
    nombre: "Ana G.",
    comentario: "Funciona bien, pero se corta en horas pico.",
    estrellas: 4,
  },
  {
    nombre: "Martin M.",
    comentario: "Se me corta todos los dias.",
    estrellas: 1,
  },
  {
    nombre: "Agustina M.",
    comentario: "Hace unos meses, funcionaba mejor.",
    estrellas: 2,
  },
];

const ReseñasDestacadas = () => {
  return (
    <section className="py-20 px-6 ">
      <div className="max-w-5xl mx-auto space-y-12 text-center">
        <h2 className="text-3xl font-bold text-texto">Reseñas destacadas</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {reseñas.map((r, i) => (
            <div
              key={i}
              className="h-full flex flex-col justify-between bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-texto text-lg italic mb-4 text-left">
                “{r.comentario}”
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "men" : "women"
                    }/${i}.jpg`}
                    alt={r.nombre}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-sm text-gray-300">— {r.nombre}</p>
                </div>
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }, (_, idx) =>
                    idx < r.estrellas ? (
                      <IconCarambolaFilled size={14} key={idx} />
                    ) : (
                      <IconCarambola size={14} key={idx} />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
