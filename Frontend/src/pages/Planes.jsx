import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";

const beneficiosBasico = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: false },
  { texto: "Acceso completo a Red-Fi Academy", disponible: false },
  { texto: "Sin anuncios ni banners promocionales", disponible: false },
  { texto: "Notificaciones básicas", disponible: false },
];

const beneficiosPremium = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: true },
  { texto: "Acceso completo a Red-Fi Academy", disponible: true },
  { texto: "Sin anuncios ni banners promocionales", disponible: true },
  { texto: "Notificaciones básicas", disponible: true },
];

const Planes = () => {
  const { usuario } = useAuth();

  useEffect(() => {
    document.title = "Red-Fi | Planes";
  }, []);

  const planActual = "premium"; // hardcodeado por ahora

  const renderBeneficios = (lista) => (
    <ul className="text-sm text-white/80 space-y-2 mb-6 text-left">
      {lista.map((b, i) => (
        <li
          key={i}
          className={`flex items-center ${!b.disponible ? "opacity-50" : ""}`}
        >
          <IconCheck
            size={18}
            className={`${b.disponible ? "text-acento" : "text-gray-400"} mr-2`}
          />
          {b.texto}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full">
      <section className="py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        {/* Encabezado */}
        <div className="w-full text-center">
          <MainH1>Elija su plan Red-Fi</MainH1>
          <p className="mx-auto">
            Compare los planes y seleccione el que mejor se adapte a sus necesidades.
          </p>
        </div>
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Básico */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <MainH2>Plan Básico</MainH2>
              <p className="text-white/70 mb-4">
                Ideal para usuarios que quieren explorar Red-Fi sin funciones avanzadas.
              </p>
              {renderBeneficios(beneficiosBasico)}
            </div>
            <Link to="/cuenta" className="mt-auto">
              <button
                className="w-full px-4 py-2 bg-primario hover:bg-acento text-white font-bold rounded-lg transition"
              >
                Adquirir Plan
              </button>
            </Link>
          </div>

          {/* Plan Premium */}
          <div className="bg-white/5 border border-acento/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <MainH2 className="text-acento">Plan Premium</MainH2>
              <p className="text-white/70 mb-4">
                Acceda a todos los beneficios de Red-Fi sin límites de uso y sin anuncios.
              </p>
              {renderBeneficios(beneficiosPremium)}
            </div>
            {usuario && planActual === "premium" ? (
              <button
                disabled
                className="mt-auto w-full px-4 py-2 bg-gray-400 text-gray-700 font-bold rounded-lg cursor-not-allowed"
              >
                Este es tu plan actual
              </button>
            ) : (
              <Link to="/cuenta" className="mt-auto">
                <button
                  className="w-full px-4 py-2 bg-primario hover:bg-acento text-white font-bold rounded-lg transition"
                >
                  Adquirir Plan
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Planes;