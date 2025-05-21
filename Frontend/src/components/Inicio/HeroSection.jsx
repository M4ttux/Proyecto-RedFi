import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-8 py-20 overflow-hidden bg-gradient-to-r from-secundario blue-950 to-primario">
      {/* 🔳 Patrón decorativo en el fondo */}
      <div
        className="absolute inset-0 bg-[url('/imgs/diagonal-lines.svg')] opacity-10"
        aria-hidden="true"
      />

      {/* 🧾 Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl gap-12">
        
        {/* 📄 Texto a la izquierda */}
        <div className="flex-1 text-left pt-8">
          <h1 className="text-5xl lg:text-6xl leading-tight drop-shadow">
            Encontrá el mejor <span className="text-shadow-lg text-shadow-acento">proveedor</span> de <span className="text-shadow-lg text-shadow-acento">Internet</span> <br /> según tu <span className="text-shadow-lg text-shadow-acento">ubicación</span>
          </h1>
          <p className="mt-6 text-lg drop-shadow">
            Visualizá qué empresas operan cerca tuyo, conocé la experiencia de otros usuarios y tomá decisiones con confianza.
          </p>

          <Link
            to="/mapa"
            className="inline-block mt-8 px-6 py-3 bg-primario rounded-full hover:bg-acento hover:scale-110 transition font-bold ease-in-out duration-300"
          >
            Ver Mapa
          </Link>
        </div>

        {/* 🗺 Imagen del mapa */}
        <div className="flex-1 flex justify-center">
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
