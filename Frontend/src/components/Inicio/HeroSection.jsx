import { Link } from "react-router-dom";
import { IconMap2 } from "@tabler/icons-react";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 py-28 bg-secundario">
      {/* 🔳 Patrón decorativo en el fondo */}
      <div
        className="absolute inset-0 bg-[url('/imgs/diagonal-lines.svg')] opacity-10 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* 🧾 Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">
        {/* 📄 Texto a la izquierda */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl leading-tight">
            Encuentre el <span className="text-acento">mejor internet</span>{" "}
            para su zona.
          </h1>
          <p className="mt-6 text-lg">
            Visualice qué empresas operan cerca suyo, conozca la experiencia de
            otros usuarios y tome decisiones con confianza.
          </p>

          <Link
            to="/mapa"
            className="inline-flex items-center mt-8 gap-2 px-6 py-3 bg-primario rounded-lg hover:bg-acento hover:scale-110 transition font-bold ease-in-out duration-300"
          >
            <IconMap2 />
            Ver mapa
          </Link>
        </div>

        {/* 🗺 Imagen del mapa */}
        <div className="flex-1 flex justify-end">
          <img
            src="/imgs/hero-placeholder2.png"
            alt="Mapa Red-Fi"
            className="w-auto max-h-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
