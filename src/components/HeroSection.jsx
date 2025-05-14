/* import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
            <img
            src="/imgs/hero-placeholder.jpg" // tu imagen real
            alt="Mapa de conexiones"
            className="w-full h-full object-cover opacity-20"
            />
        </div>

        <div className="relative z-10 px-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-primario drop-shadow-lg">
            Encontrá el mejor Internet para vos
            </h1>
            <p className="mt-4 text-lg text-texto drop-shadow-sm">
            Compará proveedores, leé experiencias reales y elegí con confianza.
            </p>
            <Link
            to="/mapa"
            className="inline-block mt-6 px-6 py-3 bg-primario text-white rounded hover:bg-acento"
            >
            Explorar Mapa
            </Link>
        </div>
        </section>
    );
};

export default HeroSection; */

import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* Imagen de fondo (editá el path más adelante) */}
      <img
        src="/imgs/hero-placeholder.jpg"
        alt="Conectividad en Argentina"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Capa de texto */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primario drop-shadow-md">
          Encontrá el mejor proveedor de Internet según tu zona
        </h1>
        <p className="mt-4 text-lg text-texto drop-shadow">
          Visualizá qué empresas operan cerca tuyo, conocé la experiencia de otros usuarios y tomá decisiones con confianza.
        </p>
        <Link
          to="/mapa"
          className="inline-block mt-6 px-6 py-3 bg-primario text-white rounded hover:bg-acento transition"
        >
          Ver Mapa
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
