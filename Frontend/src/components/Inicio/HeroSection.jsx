import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 py-16 bg-secundario min-h-[80vh]">
      {/* 🔳 Patrón decorativo en el fondo */}
      <div
        className="absolute inset-0 bg-[url('/imgs/diagonal-lines.svg')] opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* 🧾 Contenido principal */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">
        {/* 📄 Texto a la izquierda */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl leading-tight">
            Encontrá el <span className="text-acento">mejor Internet</span> para
            tu zona.
          </h1>
          <p className="mt-6 text-lg">
            Visualizá qué empresas operan cerca tuyo, conocé la experiencia de
            otros usuarios y tomá decisiones con confianza.
          </p>

          <Link
            to="/mapa"
            className="inline-block mt-8 px-6 py-3 bg-primario rounded-lg hover:bg-acento hover:scale-110 transition font-bold ease-in-out duration-300"
          >
            Ver Mapa
          </Link>
        </div>

        {/* 🗺 Imagen del mapa */}
        <div className="flex-1 flex justify-end">
          <img
            src="/imgs/hero-placeholder.jpg"
            alt="Mapa Red-Fi"
            className="w-full max-w-xl h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
